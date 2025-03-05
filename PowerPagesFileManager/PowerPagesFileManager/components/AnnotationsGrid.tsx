import * as React from "react";
import { useMemo, DragEvent, MouseEvent, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  Button,
  Label,
  tokens,
  makeStyles
} from "@fluentui/react-components";
import { useAnnotations } from "../hooks/useAnnotations";
import { IAnnotation } from "../types";
import { usePcfContext } from "../services/PcfContext";
import { formatDate } from "../utils";
import { ArrowDownloadRegular, DeleteRegular, DismissRegular } from "@fluentui/react-icons";
import { useWindowSize } from "../hooks/useWindowSize";
import { FileOverwriteDialog } from "./FileOverwriteDialog";
import { useFileUploads } from "../hooks/useFileUploads";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import HeaderButtons from "./HeaderButtons";
import { getTranslation, LanguageCode, Message } from "../utils/localization";
import * as Constants from "../utils/constants";
import { annotationService } from "../services/AnnotationService";

type SortColumn = "filename" | "createdon" | null;
type SortDirection = "asc" | "desc";

// Helper function to format file size
const formatFileSize = (sizeInKB: number): string => {
  if (sizeInKB >= 1048576) {
    return `${(sizeInKB / 1048576).toFixed(2)} GB`;
  } else if (sizeInKB >= 1024) {
    return `${(sizeInKB / 1024).toFixed(2)} MB`;
  } else {
    return `${sizeInKB} KB`;
  }
};

const useStyles = makeStyles({
  actionButton: {
    paddingLeft: '6px',
    paddingRight: '6px',
    minWidth: 'auto',
  },
  dropZone: {
    border: `2px dashed ${tokens.colorBrandBackground}`,
    padding: '20px',
    textAlign: 'center',
    width: '100%',
  },
  dropZoneContainer: {
    // Adjust these properties as needed
    marginRight: "15px",
    flexBasis: "40%"
  },
  tableContainer: {
    position: 'relative',
    maxWidth: '95%',
  },
  footer: {
    marginTop: '8px',
    fontSize: '14px',
    textAlign: 'right',
    paddingRight: '8px',
  },
  gridLoading: {
    zIndex: 1000,
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: `color-mix(in srgb, ${tokens.colorBrandForegroundInverted}, transparent 90%)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5em',
    fontWeight: 'bold',
  },
  errorMessage: {
    backgroundColor: `color-mix(in srgb, ${tokens.colorPaletteRedBackground1}, transparent 20%)` ,
    border: `1px solid ${tokens.colorPaletteRedForeground1}`,
    padding: "10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  errorText: {
    color: "#000"
  }
});

export const AnnotationsGrid = (): JSX.Element => {
  const classes = useStyles();
  const pcfcontext = usePcfContext();
  if (!pcfcontext.isVisible()) return <></>;
  if(!pcfcontext.getEntityId()) return <>This record hasn't been created yet. To enable file upload, create this record</>;

  const allowMultiple = pcfcontext.allowMultipleFiles;
  const isDisabled = pcfcontext.context.mode.isControlDisabled;
  const { annotations, error, setAnnotations, setError } = useAnnotations();

  const { uploadProgress, uploadingIds, handleFileUpload, cancelUploads } =
    useFileUploads(setAnnotations, setError);

  const [sortColumn, setSortColumn] = React.useState<SortColumn>("filename");
  const [sortDirection, setSortDirection] =
    React.useState<SortDirection>("asc");
  const [columnWidths, setColumnWidths] = React.useState({
    select: 20,
    filename: 125,
    createdon: 100,
    actions: 100,
  });
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [isProcessing, setIsProcessing] = React.useState<boolean>(false);
  const windowSize = useWindowSize();
  const isMobile = windowSize.width < 800;
  const [overwriteAll, setOverwriteAll] = React.useState<boolean>(false);
  const [showOverwriteDialog, setShowOverwriteDialog] =
    React.useState<boolean>(false);
  const [duplicateCount, setDuplicateCount] = React.useState<number>(0);
  const [showDeleteDialog, setShowDeleteDialog] =
    React.useState<boolean>(false);
  const [pendingFiles, setPendingFiles] = React.useState<File[]>([]);
  const [pendingDeleteAnnotation, setPendingDeleteAnnotation] =
    React.useState<IAnnotation | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCollapsed, setIsCollapsed] = React.useState<boolean>(false);
  const gridLoading = uploadingIds.length > 0 || isProcessing;
  const [isDragOver, setIsDragOver] = React.useState<boolean>(false);
  const pcfLanguage = pcfcontext.language as LanguageCode; // language from context

  const handleSort = (col: "filename" | "createdon") => {
    if (sortColumn === col) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(col);
      setSortDirection("asc");
    }
  };

  const sortedAnnotations = useMemo(() => {
    return [...annotations]
    .filter(annotation => annotation.display !== false)
    .sort((a, b) => {
      const aIsTemp = a.annotationid.startsWith("temp_");
      const bIsTemp = b.annotationid.startsWith("temp_");
      if (aIsTemp !== bIsTemp) {
        return aIsTemp ? -1 : 1;
      }
      if (sortColumn) {
        let aField: string | number = a[sortColumn];
        let bField: string | number = b[sortColumn];
        if (sortColumn === "createdon") {
          aField = new Date(aField as string).getTime();
          bField = new Date(bField as string).getTime();
        } else {
          aField = (aField as string).toLowerCase();
          bField = (bField as string).toLowerCase();
        }
        if (aField > bField) return sortDirection === "asc" ? 1 : -1;
        if (aField < bField) return sortDirection === "asc" ? -1 : 1;
      }
      return 0;
    });
  }, [annotations, sortColumn, sortDirection]);

  const startResizing = (
    col: "filename" | "createdon" | "actions" | "select",
    e: MouseEvent<HTMLDivElement>
  ) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = columnWidths[col];
    const onMouseMove: EventListener = (ev: Event) => {
      const mouseEv = ev as unknown as MouseEvent;
      const newWidth = startWidth + (mouseEv.clientX - startX);
      setColumnWidths((prev) => ({
        ...prev,
        [col]: newWidth > 50 ? newWidth : 50,
      }));
    };
    const onMouseUp: EventListener = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const toggleSelect = (annotationId: string) => {
    setSelectedIds((prev) =>
      prev.includes(annotationId)
        ? prev.filter((id) => id !== annotationId)
        : [...prev, annotationId]
    );
  };

  const toggleSelectAll = () => {
    const finishedIds = sortedAnnotations
      .filter((a) => !a.annotationid.startsWith("temp_"))
      .map((a) => a.annotationid);
    const areAllSelected = finishedIds.every((id) => selectedIds.includes(id));
    setSelectedIds(areAllSelected ? [] : finishedIds);
  };

  const deleteSelected = () => {
    setIsProcessing(true);
    return Promise.all(
      selectedIds.map((id) => annotationService.deleteAnnotation(id))
    )
      .then(() => {
        setAnnotations((prev) =>
          prev.filter((a) => !selectedIds.includes(a.annotationid))
        );
        setSelectedIds([]);
        return null;
      })
      .catch(() =>
        setError(getTranslation(Message.DeleteFileFailed, pcfLanguage))
      )
      .finally(() => setIsProcessing(false));
  };

  const rows = useMemo(() => {
    return sortedAnnotations.map((annotation) => {
      const displayName = annotation.filename.endsWith(
        Constants.AZURE_FILE_EXTENSION
      )
        ? annotation.filename.slice(0, -Constants.AZURE_FILE_EXTENSION.length)
        : annotation.filename;
      return (
        <TableRow key={annotation.annotationid}>
          {!isDisabled && (
            <TableCell
              style={{ width: columnWidths.select, textAlign: "center" }}
            >
              {!annotation.annotationid.startsWith("temp_") && (
                <input
                  type="checkbox"
                  checked={selectedIds.includes(annotation.annotationid)}
                  onChange={() => toggleSelect(annotation.annotationid)}
                />
              )}
            </TableCell>
          )}
          <TableCell
            title={displayName}
            style={{
              maxWidth: columnWidths.filename,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {displayName}
          </TableCell>
          <TableCell>
            {annotation.annotationid.startsWith("temp_") ? (
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    flex: "1",
                    background: "#e1dfdd",
                    height: "10px",
                    borderRadius: "5px",
                    marginRight: "5px",
                  }}
                >
                  <div
                    style={{
                      background: "#018a39",
                      width: `${uploadProgress[annotation.annotationid] ?? 0}%`,
                      height: "10px",
                      borderRadius: "5px",
                    }}
                  />
                </div>
                <span>
                  {(uploadProgress[annotation.annotationid] ?? 0).toFixed(0)}%
                </span>
              </div>
            ) : (
              formatDate(annotation.createdon)
            )}
          </TableCell>
          {!isDisabled && (
          <TableCell
            style={{
              display: "flex",
              gap: isMobile ? "2px" : "5px",
              width: isMobile ? 75 : undefined,
            }}
          >
            {isMobile ? (
              <>
                <Button
                  appearance="subtle"
                  title={getTranslation(Message.DownloadButton, pcfLanguage)}
                  aria-label={getTranslation(
                    Message.DownloadButton,
                    pcfLanguage
                  )}
                  style={{ padding: "2px", minWidth: "auto" }}
                  onClick={() =>
                    window.open(
                      annotationService.getDownloadUrl(annotation.annotationid),
                      "_blank"
                    )
                  }
                >
                  <ArrowDownloadRegular style={{ fontSize: "32px" }} />
                </Button>
                <Button
                  appearance="subtle"
                  title={getTranslation(Message.DeleteButton, pcfLanguage)}
                  aria-label={getTranslation(Message.DeleteButton, pcfLanguage)}
                  style={{ padding: "2px", minWidth: "auto" }}
                  onClick={() => {
                    setPendingDeleteAnnotation(annotation);
                    setShowDeleteDialog(true);
                  }}
                >
                  <DeleteRegular style={{ fontSize: "32px" }} />
                </Button>
              </>
            ) : (
              <>
                <Button
                  appearance="subtle"
                  aria-label={getTranslation(
                    Message.DownloadButton,
                    pcfLanguage
                  )}
                  title={getTranslation(Message.DownloadButton, pcfLanguage)}
                  onClick={() =>
                    window.open(
                      annotationService.getDownloadUrl(annotation.annotationid),
                      "_blank"
                    )
                  }
                  className={classes.actionButton}
                >
                  {getTranslation(Message.DownloadButton, pcfLanguage)}
                </Button>
                <Button
                  title={getTranslation(Message.DeleteButton, pcfLanguage)}
                  aria-label={getTranslation(Message.DeleteButton, pcfLanguage)}
                  appearance="subtle"
                  onClick={() => {
                    setPendingDeleteAnnotation(annotation);
                    setShowDeleteDialog(true);
                  }}
                  className={classes.actionButton}
                >
                  {getTranslation(Message.DeleteButton, pcfLanguage)}
                </Button>
              </>
            )}
          </TableCell>
          )}
        </TableRow>
      );
    });
  }, [
    sortedAnnotations,
    uploadProgress,
    setAnnotations,
    setError,
    columnWidths,
    selectedIds,
    isMobile,
    isDisabled,
  ]);

  const singleFileAnnotation = annotations.find(annotation => annotation.display !== false);

  // New helper to process files with identical validation logic as in handleDrop.
  const processFiles = (files: File[]) => {
    const errors: string[] = [];
    // If maxNumberOfFiles is defined (> 0), check total count.
    const allowedTotal = pcfcontext.maxNumberOfFiles;
    const currentCount = annotations.length;
    if (allowedTotal > 0 && currentCount + files.length > allowedTotal) {
      errors.push(
        getTranslation("MaxFilesExceeded", pcfLanguage, {
          allowedTotal: allowedTotal,
          currentCount: currentCount,
          remaining: allowedTotal - currentCount,
        })
      );
    }

    // Check for oversize files.
    const allowedSizeBytes = (pcfcontext.uploadSizeLimitKB || 10485760) * 1024;
    const oversizedFiles = files.filter((file) => file.size > allowedSizeBytes);
    if (oversizedFiles.length > 0) {
      if (oversizedFiles.length === 1) {
        errors.push(
          getTranslation(Message.OversizeFileError, pcfLanguage, {
            fileName: oversizedFiles[0].name,
            maxSize: pcfcontext.uploadSizeLimitKB,
          })
        );
      } else {
        errors.push(
          getTranslation(Message.OversizeFilesError, pcfLanguage, {
            count: oversizedFiles.length,
            maxSize: pcfcontext.uploadSizeLimitKB,
          })
        );
      }
    }

    // Check allowed file types and mime types.
    const allowedFileTypesList = pcfcontext.allowedFileTypes
      ? pcfcontext.allowedFileTypes
          .split(",")
          .map((s) => s.trim().toLowerCase())
      : [];
    const allowedMimeTypesList = pcfcontext.allowedMimeTypes
      ? pcfcontext.allowedMimeTypes
          .split(",")
          .map((s) => s.trim().toLowerCase())
      : [];
    const disallowedFiles = files.filter((file) => {
      const ext = file.name.split(".").pop()?.toLowerCase() || "";
      const mime = file.type.toLowerCase();
      const typeNotAllowed =
        allowedFileTypesList.length && !allowedFileTypesList.includes(ext);
      const mimeNotAllowed =
        allowedMimeTypesList.length && !allowedMimeTypesList.includes(mime);
      return typeNotAllowed || mimeNotAllowed;
    });
    if (disallowedFiles.length > 0) {
      errors.push(
        getTranslation(Message.DisallowedFileError, pcfLanguage, {
          count: disallowedFiles.length,
        })
      );
    }

    if (errors.length > 0) {
      setError(errors.map((e) => `- ${e}\n`).join(""));
      return;
    }

    const duplicateMap = new Map<string, File[]>();
    const nonDuplicates: File[] = [];
    files.forEach((file) => {
      const isDuplicate = annotations.some((a) => {
        const normalized = a.filename.endsWith(Constants.AZURE_FILE_EXTENSION)
          ? a.filename.slice(0, -Constants.AZURE_FILE_EXTENSION.length)
          : a.filename;
        return normalized === file.name;
      });
      if (isDuplicate) {
        const group = duplicateMap.get(file.name) || [];
        group.push(file);
        duplicateMap.set(file.name, group);
      } else {
        nonDuplicates.push(file);
      }
    });

    if (duplicateMap.size > 0 && !overwriteAll) {
      const allDupFiles = Array.from(duplicateMap.values()).flat();
      setDuplicateCount(allDupFiles.length);
      setPendingFiles(allDupFiles);
      setShowOverwriteDialog(true);
      nonDuplicates.forEach((file) => handleFileUpload(file));
      return;
    }

    nonDuplicates.forEach((file) => handleFileUpload(file));
  };

  // Updated handleDrop to use processFiles.
  const handleDrop = (ev: DragEvent<HTMLDivElement>) => {
    ev.preventDefault();
    setIsDragOver(false);
    const items = Array.from(ev.dataTransfer.items);
    for (const item of items) {
      const entry = item.webkitGetAsEntry && item.webkitGetAsEntry();
      if (entry && entry.isDirectory) {
        setError(getTranslation(Message.FolderUploadNotAllowed, pcfLanguage));
        return;
      }
    }
    const files = Array.from(ev.dataTransfer.files);
    processFiles(files);
  };

  // Updated handleFileSelect to use processFiles.
  const handleFileSelect = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const files = ev.target.files ? Array.from(ev.target.files) : [];
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (files.length > 0) {
      processFiles(files);
    }
  };

  const deleteDuplicateAnnotations = (fileName: string): Promise<void> => {
    // If overwriteAll is true, assume deletion has already been initiated.
    if (overwriteAll) {
      return Promise.resolve();
    }
    const duplicates = annotations.filter((a) => {
      const normalized = a.filename.endsWith(Constants.AZURE_FILE_EXTENSION)
        ? a.filename.slice(0, -Constants.AZURE_FILE_EXTENSION.length)
        : a.filename;
      return normalized === fileName;
    });
    return Promise.all(
      duplicates.map((d) => annotationService.deleteAnnotation(d.annotationid))
    )
      .then(() => {
        setAnnotations((prev) =>
          prev.filter((a) => {
            const normalized = a.filename.endsWith(
              Constants.AZURE_FILE_EXTENSION
            )
              ? a.filename.slice(0, -Constants.AZURE_FILE_EXTENSION.length)
              : a.filename;
            return normalized !== fileName;
          })
        );
        return undefined;
      })
      .catch(() =>
        setError(
          getTranslation(Message.DeleteDuplicateAnnotationsFailed, pcfLanguage)
        )
      );
  };

  // Handler when user confirms deletion in the dialog.
  const handleDeleteConfirm = () => {
    setShowDeleteDialog(false);
    if (pendingDeleteAnnotation) {
      return annotationService
        .deleteAnnotation(pendingDeleteAnnotation.annotationid)
        .then((): void => {
          setAnnotations((prev) =>
            prev.filter(
              (a) => a.annotationid !== pendingDeleteAnnotation.annotationid
            )
          );
          setSelectedIds((prev) =>
            prev.filter((id) => id !== pendingDeleteAnnotation.annotationid)
          );
          return undefined;
        })
        .catch(() =>
          setError(getTranslation(Message.DeleteFileFailed, pcfLanguage))
        )
        .finally(() => {
          setPendingDeleteAnnotation(null);
        });
    } else {
      // Batch deletion if no single file flagged.
      deleteSelected();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        padding: "10px",
        width: "100%",
      }}
    >
      {error && (
        <div
          role="alert"
          aria-live="assertive"
          className={classes.errorMessage}
        >
          <span>{error}</span>
          <Button
            appearance="secondary"
            onClick={() => setError("")}
            aria-label={getTranslation(Message.DismissError, pcfLanguage)}
          >
            Dismiss
          </Button>
        </div>
      )}

      {/* Conditional rendering based on allowMultiple */}
      {!allowMultiple ? (
        !singleFileAnnotation ? (
          // Show drop zone if no file has been uploaded yet.
          <div
            onDrop={(ev) => {
              handleDrop(ev);
              setIsDragOver(false);
            }}
            onDragOver={(ev) => {
              ev.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={(ev) => {
              ev.preventDefault();
              setIsDragOver(false);
            }}
            role="region"
            tabIndex={0}
            aria-label={
              getTranslation(Message.DragAndDropFile, pcfLanguage) +
              " " +
              getTranslation(Message.SelectFile, pcfLanguage)
            }
            className={classes.dropZone}
            style={{
              ...(isDragOver
                ? { backgroundColor: `color-mix(in srgb, ${tokens.colorBrandBackgroundInvertedHover}, transparent 90%)`, borderColor: tokens.colorCompoundBrandBackgroundHover }
                : {}),
            }}
          >
            <Label style={{ marginBottom: "5px", fontSize: "18px" }}>
              {getTranslation(Message.DragAndDropFile, pcfLanguage)}
            </Label>
            <Label style={{ display: "block", marginBottom: "5px" }}>or</Label>
            <Button
              appearance="primary"
              onClick={() => fileInputRef.current?.click()}
              aria-label={getTranslation(Message.SelectFiles, pcfLanguage)}
            >
              {getTranslation(Message.SelectFile, pcfLanguage)}
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              hidden
              onChange={handleFileSelect}
              // For allowMultiple false, we only permit one
              multiple={false}
              aria-label={getTranslation(Message.SelectFile, pcfLanguage)}
            />
            {/* Updated labels to be on the same line with proper punctuation and spacing */}
            <div
              style={{
                marginTop: "10px",
                fontSize: "11px",
                color: "#888",
                fontWeight: "normal",
              }}
            >
              {pcfcontext.maxNumberOfFiles > 0 && (
                <span>
                  {getTranslation(Message.MaxFilesAllowed, pcfLanguage, {
                    count: pcfcontext.maxNumberOfFiles,
                  })}
                  .{" "}
                </span>
              )}
              <span>
                {getTranslation(Message.MaxFileSizeAllowed, pcfLanguage, {
                  size: formatFileSize(pcfcontext.uploadSizeLimitKB),
                })}
                .
              </span>
            </div>
          </div>
        ) : (
          // Show single file card when a file is present.
          <div
            role="region"
            aria-label="Uploaded file information"
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div>
                <strong>{singleFileAnnotation.filename}</strong>
              </div>
              <div>
                {singleFileAnnotation.annotationid.startsWith("temp_") ? (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div
                      style={{
                        flex: "1",
                        background: "#e1dfdd",
                        height: "10px",
                        borderRadius: "5px",
                        marginRight: "5px",
                      }}
                    >
                      <div
                        style={{
                          background: "#018a39",
                          width: `${
                            uploadProgress[annotations[0].annotationid] ?? 0
                          }%`,
                          height: "10px",
                          borderRadius: "5px",
                        }}
                      />
                    </div>
                    <span>
                      {(
                        uploadProgress[singleFileAnnotation.annotationid] ?? 0
                      ).toFixed(0)}
                      %
                    </span>
                  </div>
                ) : (
                  formatDate(singleFileAnnotation.createdon)
                )}
              </div>
            </div>
            <div style={{ display: "flex", gap: "5px" }}>
            {singleFileAnnotation.annotationid.startsWith("temp_") && (
                <Button
                  appearance="subtle"
                  onClick={() => {
                    // Cancel the upload and clear annotations so drop zone reappears.
                    cancelUploads();
                    setAnnotations([]);
                  }}
                  title={getTranslation(Message.CancelUpload, pcfLanguage)}
                  aria-label={getTranslation(Message.CancelUpload, pcfLanguage)}
                  className={classes.actionButton}
                >
                  <DismissRegular style={{ fontSize: "24px" }} />
                </Button>
              )}
              <Button
                appearance="subtle"
                onClick={() =>
                  window.open(
                    annotationService.getDownloadUrl(
                      singleFileAnnotation.annotationid
                    ),
                    "_blank"
                  )
                }
                title={getTranslation(Message.DownloadButton, pcfLanguage)}
                aria-label={getTranslation(Message.DownloadButton, pcfLanguage)}
                className={classes.actionButton}
              >
                <ArrowDownloadRegular style={{ fontSize: "24px" }} />
              </Button>
              <Button
                appearance="subtle"
                onClick={() => {
                  // Delete the single file and clear annotations so drop zone reappears.
                  annotationService
                    .deleteAnnotation(singleFileAnnotation.annotationid)
                    .then(() => setAnnotations([]))
                    .catch(() =>
                      setError(
                        getTranslation(Message.DeleteFileFailed, pcfLanguage)
                      )
                    );
                }}
                title={getTranslation(Message.DeleteFile, pcfLanguage)}
                aria-label={getTranslation(Message.DeleteFile, pcfLanguage)}
                className={classes.actionButton}
              >
                <DeleteRegular style={{ fontSize: "24px" }} />
              </Button>              
            </div>
          </div>
        )
      ) : (
        // Multiple file mode with layout wrapper
        <div
          style={{
            display: "flex",
            flexDirection:
              pcfcontext.layout === "Horizontal" ? "row" : "column",
            gap: isCollapsed ? "0px" : "15px",
            alignItems: "stretch",
          }}
        >
          {!isDisabled && (
            <div
              onDrop={(ev) => {
                handleDrop(ev);
                setIsDragOver(false);
              }}
              onDragOver={(ev) => {
                ev.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={(ev) => {
                ev.preventDefault();
                setIsDragOver(false);
              }}
              role="region"
              tabIndex={0}
              aria-label={
                getTranslation("DragAndDrop", pcfLanguage) +
                " " +
                getTranslation("SelectFiles", pcfLanguage)
              }
              className={classes.dropZone}
              style={{
                ...(isDragOver
                  ? { backgroundColor: `color-mix(in srgb, ${tokens.colorBrandBackgroundInvertedHover}, transparent 90%)`, borderColor: tokens.colorCompoundBrandBackgroundHover }
                  : {}),
              }}
            >
              <Label style={{ marginBottom: "5px", fontSize: "18px" }}>
                {getTranslation("DragAndDrop", pcfLanguage)}
              </Label>
              <Label style={{ display: "block", marginBottom: "5px" }}>
                or
              </Label>
              <Button
                appearance="primary"
                onClick={() => fileInputRef.current?.click()}
                aria-label={getTranslation("SelectFiles", pcfLanguage)}
              >
                {getTranslation("SelectFiles", pcfLanguage)}
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                hidden
                onChange={handleFileSelect}
                multiple
                aria-label={getTranslation("SelectFiles", pcfLanguage)}
              />

              {/* Updated labels to be on the same line with proper punctuation and spacing */}
              <div
                style={{
                  marginTop: "10px",
                  fontSize: "11px",
                  color: "#888",
                  fontWeight: "normal",
                }}
              >
                {pcfcontext.maxNumberOfFiles > 0 && (
                  <span>
                    {getTranslation(Message.MaxFilesAllowed, pcfLanguage, {
                      count: pcfcontext.maxNumberOfFiles,
                    })}
                    .{" "}
                  </span>
                )}
                <span>
                  {getTranslation(Message.MaxFileSizeAllowed, pcfLanguage, {
                    size: formatFileSize(pcfcontext.uploadSizeLimitKB),
                  })}
                  .
                </span>
              </div>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            {isCollapsed && pcfcontext.layout !== "Horizontal" && (
              <Button
                appearance="primary"
                onClick={() => setIsCollapsed(false)}
                aria-label={getTranslation("ShowFiles", pcfLanguage)}
                style={{ marginTop: "5px" }}
              >
                {getTranslation("ShowFiles", pcfLanguage)}
              </Button>
            )}
            {!isCollapsed && (
              <>
                {!isDisabled && annotations.length > 0 && (
                  <HeaderButtons
                    selectedCount={selectedIds.length}
                    uploadingCount={uploadingIds.length}
                    onDelete={() => setShowDeleteDialog(true)}
                    onCancel={cancelUploads}
                    onToggleCollapse={() => setIsCollapsed(true)}
                    language={pcfLanguage}
                  />
                )}

                {annotations.length > 0 && (
                  <div
                    role="region"
                    aria-label="Files table"
                    className={classes.tableContainer}
                    style={{
                      position: "relative",
                      ...(pcfcontext.maxGridHeight > 0
                        ? {
                            maxHeight: `${pcfcontext.maxGridHeight}px`,
                            overflowY: "auto",
                          }
                        : {}),
                    }}
                  >
                    <Table
                      role="table"
                      style={{ width: "100%", tableLayout: "fixed" }}
                    >
                      <TableHeader>
                        <TableRow>
                          {!isDisabled && (
                            <TableCell
                              style={{
                                width: columnWidths.select,
                                position: "relative",
                                textAlign: "center",
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={sortedAnnotations
                                  .filter(
                                    (a) => !a.annotationid.startsWith("temp_")
                                  )
                                  .every((a) =>
                                    selectedIds.includes(a.annotationid)
                                  )}
                                onChange={toggleSelectAll}
                              />
                            </TableCell>
                          )}
                          <TableCell
                            style={{
                              width: columnWidths.filename,
                              position: "relative",
                            }}
                            onClick={() => handleSort("filename")}
                          >
                            <span
                              title={getTranslation(
                                "SortByFilename",
                                pcfLanguage
                              )}
                            >
                              {getTranslation(
                                "GridFilenameHeader",
                                pcfLanguage
                              )}{" "}
                              {sortColumn === "filename"
                                ? sortDirection === "asc"
                                  ? "▲"
                                  : "▼"
                                : ""}
                            </span>
                            <div
                              className="resizer"
                              onMouseDown={(e) => startResizing("filename", e)}
                              style={{
                                position: "absolute",
                                right: 0,
                                top: 0,
                                bottom: 0,
                                width: "5px",
                                cursor: "col-resize",
                              }}
                            />
                          </TableCell>
                          <TableCell
                            style={{
                              width: columnWidths.createdon,
                              position: "relative",
                            }}
                            onClick={() => handleSort("createdon")}
                          >
                            <span
                              title={getTranslation(
                                "SortByCreatedOn",
                                pcfLanguage
                              )}
                            >
                              {getTranslation(
                                "GridCreatedOnHeader",
                                pcfLanguage
                              )}{" "}
                              {sortColumn === "createdon"
                                ? sortDirection === "asc"
                                  ? "▲"
                                  : "▼"
                                : ""}
                            </span>
                            <div
                              className="resizer"
                              onMouseDown={(e) => startResizing("createdon", e)}
                              style={{
                                position: "absolute",
                                right: 0,
                                top: 0,
                                bottom: 0,
                                width: "5px",
                                cursor: "col-resize",
                              }}
                            />
                          </TableCell>
                          {!isDisabled && (
                          <TableCell
                            style={{
                              width: isMobile ? 50 : columnWidths.actions,
                              position: "relative",
                            }}
                          >
                            {getTranslation(
                              Message.GridActionsOnHeader,
                              pcfLanguage
                            )}
                            <div
                              className="resizer"
                              onMouseDown={(e) => startResizing("actions", e)}
                              style={{
                                position: "absolute",
                                right: 0,
                                top: 0,
                                bottom: 0,
                                width: "5px",
                                cursor: "col-resize",
                              }}
                            />
                          </TableCell>
                          )}
                        </TableRow>
                      </TableHeader>
                      <TableBody>{rows}</TableBody>
                    </Table>
                    {/* Footer displaying total and selected file count */}
                    <div className={classes.footer}>
                      {getTranslation(Message.GridFooterTotal, pcfLanguage, {
                        total: annotations.length,
                      })}
                      {selectedIds.length > 0 &&
                        getTranslation(
                          Message.GridFooterSelected,
                          pcfLanguage,
                          { selected: selectedIds.length }
                        )}
                    </div>
                    {gridLoading && (
                      <div
                        className={classes.gridLoading}
                        aria-live="assertive"
                      >
                        {getTranslation(Message.GridLoading, pcfLanguage)}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {isCollapsed && pcfcontext.layout === "Horizontal" && (
        <Button
          appearance="primary"
          onClick={() => setIsCollapsed(false)}
          aria-label={getTranslation("ShowFiles", pcfLanguage)}
          style={{ marginTop: "5px" }}
        >
          {getTranslation("ShowFiles", pcfLanguage)}
        </Button>
      )}

      {showDeleteDialog && (
        <DeleteConfirmationDialog
          count={pendingDeleteAnnotation ? 1 : selectedIds.length}
          onConfirm={handleDeleteConfirm}
          onCancel={() => {
            setShowDeleteDialog(false);
            setPendingDeleteAnnotation(null);
          }}
          language={pcfLanguage}
        />
      )}

      {showOverwriteDialog && pendingFiles.length > 0 && (
        <FileOverwriteDialog
          fileName={pendingFiles[0].name}
          duplicateCount={duplicateCount}
          language={pcfLanguage}
          onOverwrite={() => {
            setIsProcessing(true);
            setShowOverwriteDialog(false);
            return deleteDuplicateAnnotations(pendingFiles[0].name)
              .then((): void => {
                handleFileUpload(pendingFiles[0]);
                setPendingFiles([]);
                return undefined;
              })
              .catch(() => {
                setError(
                  getTranslation(Message.DeleteAnnotationFailed, pcfLanguage)
                );
                setPendingFiles([]);
              })
              .finally(() => {
                setIsProcessing(false);
              });
          }}
          onOverwriteAll={() => {
            setOverwriteAll(true);
            setIsProcessing(true);
            setShowOverwriteDialog(false);
            const uniqueNames = Array.from(
              new Set(pendingFiles.map((file) => file.name))
            );
            return Promise.all(
              uniqueNames.map((name) => deleteDuplicateAnnotations(name))
            )
              .then((): void => {
                pendingFiles.forEach((file) => handleFileUpload(file));
                setPendingFiles([]);
                return undefined;
              })
              .catch(() => {
                setError(
                  getTranslation(
                    Message.DeleteDuplicateAnnotationsFailed,
                    pcfLanguage
                  )
                );
                setPendingFiles([]);
              })
              .finally(() => {
                setIsProcessing(false);
                setOverwriteAll(false);
              });
          }}
          onCancel={() => {
            setShowOverwriteDialog(false);
            setPendingFiles([]);
          }}
        />
      )}
    </div>
  );
};
