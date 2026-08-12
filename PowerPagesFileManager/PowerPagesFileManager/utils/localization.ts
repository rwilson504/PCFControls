export type LanguageCode = 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ja' | 'ko' | 'it' | 'nl' | 'pt';

// Define a mapping of translation keys to the type of parameters needed
interface TranslationParams {
  DragAndDrop: undefined;
  DragAndDropFile: undefined;
  SelectFile: undefined;
  SelectFiles: undefined;
  FolderUploadNotAllowed: undefined;
  DownloadButton: undefined;
  DeleteAnnotationFailed: undefined;
  DeleteButton: undefined;
  DeleteFile: undefined;
  DeleteFileFailed: undefined;
  DeleteDuplicateAnnotationsFailed: undefined;
  LoadingAnnotations: undefined;
  InitializingFileUpload: undefined;
  UploadingChunk: undefined;
  DeletingFile: undefined;
  SortByFilename: undefined;
  SortByCreatedOn: undefined;
  GridFilenameHeader: undefined;
  GridCreatedOnHeader: undefined;
  GridActionsOnHeader: undefined;
  GridLoading: undefined;
  GridFooterSelected: {selected: number};
  GridFooterTotal: { total: number }; // Pass selected as
  MaxFilesExceeded: { allowedTotal: number; currentCount: number; remaining: number };
  OversizeFileError: { fileName: string; maxSize: number };
  OversizeFilesError: { count: number; maxSize: number };
  MaxFilesAllowed: { count: number };
  MaxFileSizeAllowed: { size: string };
  DisallowedFileError: { count: number };
  DeleteSelected: undefined;
  CancelUpload: undefined;
  HideFiles: undefined;
  ShowFiles: undefined;
  ForSingle: undefined;
  FileOverwriteDialogTitle: undefined;
  FileOverwriteDialogMessage: { fileName: string; extraCount?: number };
  FileOverwriteDialogConfirm: undefined;
  FileOverwriteDialogConfirmAll: undefined;
  FileOverwriteDialogCancel: undefined;
  DeleteConfirmation: undefined;
  DeleteConfirmationSingle: undefined;
  DeleteConfirmationMultiple: { count: number };
  ConfirmDelete: undefined;
  Cancel: undefined;
  DismissError: undefined;
  GridFooter: { total: number; selected: string };  // Pass selected as an empty string when none.
  // File API failures. Deliberately fewer entries than the server has codes, see
  // utils/fileApiErrors.ts.
  FileErrorEmptyFile: undefined;
  FileErrorRecordNotFound: undefined;
  FileErrorNoPermission: undefined;
  FileErrorTypeNotAllowed: undefined;
  FileErrorTooLarge: undefined;
  FileErrorFileUnavailable: undefined;
  FileErrorNotConfigured: undefined;
  FileErrorUnexpected: undefined;
  LoadFilesFailed: undefined;
  CheckExistingFilesFailed: undefined;
  UploadFileFailed: { fileName: string };
  // Add additional keys and their parameters here as needed.
}

// Create a union type of all valid keys from TranslationParams
export type ValidTranslationKey = keyof TranslationParams;
// Removed duplicate export declaration

// Create an enum for translation keys for design‐time safety
export enum Message {
  DragAndDrop = "DragAndDrop",
  DragAndDropFile = "DragAndDropFile",
  SelectFile = "SelectFile",
  SelectFiles = "SelectFiles",
  FolderUploadNotAllowed = "FolderUploadNotAllowed",
  DownloadButton = "DownloadButton",
  DeleteAnnotationFailed = "DeleteAnnotationFailed",
  DeleteFile = "DeleteFile",
  DeleteFileFailed = "DeleteFileFailed",
  DeleteDuplicateAnnotationsFailed = "DeleteDuplicateAnnotationsFailed",
  DeleteButton = "DeleteButton",
  LoadingAnnotations = "LoadingAnnotations",
  InitializingFileUpload = "InitializingFileUpload",
  UploadingChunk = "UploadingChunk",
  DeletingFile = "DeletingFile",
  SortByFilename = "SortByFilename",
  SortByCreatedOn = "SortByCreatedOn",
  GridFilenameHeader = "GridFilenameHeader",
  GridCreatedOnHeader = "GridCreatedOnHeader",
  GridActionsOnHeader = "GridActionsOnHeader",
  GridLoading = "GridLoading",
  GridFooterSelected = "GridFooterSelected",
  GridFooterTotal = "GridFooterTotal",
  MaxFilesExceeded = "MaxFilesExceeded",
  OversizeFileError = "OversizeFileError",
  OversizeFilesError = "OversizeFilesError",
  DisallowedFileError = "DisallowedFileError",
  DeleteSelected = "DeleteSelected",
  CancelUpload = "CancelUpload",
  HideFiles = "HideFiles",
  ShowFiles = "ShowFiles",
  ForSingle = "ForSingle",
  FileOverwriteDialogTitle = "FileOverwriteDialogTitle",
  FileOverwriteDialogMessage = "FileOverwriteDialogMessage",
  FileOverwriteDialogConfirm = "FileOverwriteDialogConfirm",
  FileOverwriteDialogConfirmAll = "FileOverwriteDialogConfirmAll",
  FileOverwriteDialogCancel = "FileOverwriteDialogCancel",
  DeleteConfirmation = "DeleteConfirmation",
  DeleteConfirmationSingle = "DeleteConfirmationSingle",
  DeleteConfirmationMultiple = "DeleteConfirmationMultiple",
  ConfirmDelete = "ConfirmDelete",
  Cancel = "Cancel",
  DismissError = "DismissError",
  GridFooter = "GridFooter",
  MaxFilesAllowed = "MaxFilesAllowed",
  MaxFileSizeAllowed = "MaxFileSizeAllowed",
  FileErrorEmptyFile = "FileErrorEmptyFile",
  FileErrorRecordNotFound = "FileErrorRecordNotFound",
  FileErrorNoPermission = "FileErrorNoPermission",
  FileErrorTypeNotAllowed = "FileErrorTypeNotAllowed",
  FileErrorTooLarge = "FileErrorTooLarge",
  FileErrorFileUnavailable = "FileErrorFileUnavailable",
  FileErrorNotConfigured = "FileErrorNotConfigured",
  FileErrorUnexpected = "FileErrorUnexpected",
  LoadFilesFailed = "LoadFilesFailed",
  CheckExistingFilesFailed = "CheckExistingFilesFailed",
  UploadFileFailed = "UploadFileFailed"
}

type Translations = Record<string, Record<LanguageCode, string>>;

const translations: Translations = {
  DragAndDrop: {
    en: "Drag and drop files here",
    es: "Arrastra y suelta archivos aquí",
    fr: "Glissez et déposez les fichiers ici",
    de: "Dateien hierher ziehen und ablegen",
    zh: "将文件拖放到此处",
    ja: "ここにファイルをドラッグアンドドロップ",
    ko: "파일을 여기로 드래그 앤 드롭하세요",
    it: "Trascina e rilascia i file qui",
    nl: "Sleep hier bestanden naartoe",
    pt: "Arraste e solte arquivos aqui"
  },
  DragAndDropFile: {
    en: "Drag and drop file here",
    es: "Arrastra y suelta el archivo aquí",
    fr: "Glissez et déposez le fichier ici",
    de: "Datei hierher ziehen und ablegen",
    zh: "将文件拖放到此处",
    ja: "ここにファイルをドラッグアンドドロップ",
    ko: "파일을 여기로 드래그 앤 드롭하세요",
    it: "Trascina e rilascia il file qui",
    nl: "Sleep hier bestand naartoe",
    pt: "Arraste e solte o arquivo aqui"    
  },
  SelectFiles: {
    en: "Select Files",
    es: "Seleccionar archivos",
    fr: "Sélectionner des fichiers",
    de: "Dateien auswählen",
    zh: "选择文件",
    ja: "ファイルを選択",
    ko: "파일 선택",
    it: "Seleziona file",
    nl: "Bestanden selecteren",
    pt: "Selecionar arquivos"
  },
  SelectFile: {
    en: "Select File",
    es: "Seleccionar archivo",
    fr: "Sélectionner le fichier",
    de: "Datei auswählen",
    zh: "选择文件",
    ja: "ファイルを選択",
    ko: "파일 선택",
    it: "Seleziona file",
    nl: "Bestand selecteren",
    pt: "Selecionar arquivo"
  },
  FolderUploadNotAllowed: {
    en: "Uploading folders is not allowed. Please select files only.",
    es: "La carga de carpetas no está permitida. Por favor, seleccione solo archivos.",
    fr: "Le téléchargement de dossiers n'est pas autorisé. Veuillez sélectionner uniquement des fichiers.",
    de: "Das Hochladen von Ordnern ist nicht erlaubt. Bitte wählen Sie nur Dateien aus.",
    zh: "不允许上传文件夹。请选择文件。",
    ja: "フォルダーのアップロードは禁止されています。ファイルのみを選択してください。",
    ko: "폴더 업로드는 허용되지 않습니다. 파일만 선택하십시오.",
    it: "Non è possibile caricare cartelle. Seleziona solo file.",
    nl: "Het uploaden van mappen is niet toegestaan. Selecteer alleen bestanden.",
    pt: "O upload de pastas não é permitido. Por favor, selecione apenas arquivos."
  },
  DeleteAnnotationFailed: {
    en: "Failed to delete annotation.",
    es: "No se pudo eliminar la anotación.",
    fr: "La suppression de l'annotation a échoué.",
    de: "Löschen der Annotation fehlgeschlagen.",
    zh: "删除批注失败。",
    ja: "注釈の削除に失敗しました。",
    ko: "주석 삭제에 실패했습니다.",
    it: "Impossibile eliminare l'annotazione.",
    nl: "Het verwijderen van de annotatie is mislukt.",
    pt: "Falha ao excluir a anotação."
  },
  DeleteFile: {
    en: "Delete file",
    es: "Eliminar archivo",
    fr: "Supprimer le fichier",
    de: "Datei löschen",
    zh: "删除文件",
    ja: "ファイルを削除",
    ko: "파일 삭제",
    it: "Elimina file",
    nl: "Verwijder bestand",
    pt: "Excluir arquivo"
  },
  DeleteFileFailed: {
    en: "Failed to delete file.",
    es: "No se pudo eliminar el archivo.",
    fr: "La suppression du fichier a échoué.",
    de: "Löschen der Datei fehlgeschlagen.",
    zh: "删除文件失败。",
    ja: "ファイルの削除に失敗しました。",
    ko: "파일 삭제에 실패했습니다.",
    it: "Impossibile eliminare il file.",
    nl: "Het verwijderen van het bestand is mislukt.",
    pt: "Falha ao excluir o arquivo."
  },
  DeleteDuplicateAnnotationsFailed: {
    en: "Failed to delete duplicate annotations.",
    es: "No se pudieron eliminar las anotaciones duplicadas.",
    fr: "La suppression des annotations dupliquées a échoué.",
    de: "Löschen der doppelten Annotationen fehlgeschlagen.",
    zh: "删除重复批注失败。",
    ja: "重複する注釈の削除に失敗しました。",
    ko: "중복된 주석 삭제에 실패했습니다.",
    it: "Impossibile eliminare le annotazioni duplicate.",
    nl: "Het verwijderen van dubbele annotaties is mislukt.",
    pt: "Falha ao excluir anotações duplicadas."
  },
  LoadingAnnotations: {
    en: "Loading annotations...",
    es: "Cargando anotaciones...",
    fr: "Chargement des annotations...",
    de: "Lade Annotationen...",
    zh: "加载批注中...",
    ja: "注釈を読み込み中...",
    ko: "주석을 불러오는 중...",
    it: "Caricamento annotazioni...",
    nl: "Annotaties laden...",
    pt: "Carregando anotações..."
  },
  InitializingFileUpload: {
    en: "Initializing file upload...",
    es: "Inicializando la carga de archivos...",
    fr: "Initialisation du téléchargement du fichier...",
    de: "Datei-Upload wird initialisiert...",
    zh: "正在初始化文件上传...",
    ja: "ファイルのアップロードを初期化しています...",
    ko: "파일 업로드 초기화 중...",
    it: "Inizializzazione del caricamento file...",
    nl: "Bestand upload initialiseren...",
    pt: "Inicializando o envio do arquivo..."
  },
  UploadingChunk: {
    en: "Uploading chunk...",
    es: "Cargando fragmento...",
    fr: "Téléchargement du fragment...",
    de: "Lade Datenblock hoch...",
    zh: "正在上传分块...",
    ja: "チャンクをアップロード中...",
    ko: "청크 업로드 중...",
    it: "Caricamento del blocco...",
    nl: "Chunk uploaden...",
    pt: "Enviando parte do arquivo..."
  },
  DeletingFile: {
    en: "Deleting file...",
    es: "Eliminando archivo...",
    fr: "Suppression du fichier...",
    de: "Datei wird gelöscht...",
    zh: "正在删除文件...",
    ja: "ファイルを削除中...",
    ko: "파일 삭제 중...",
    it: "Eliminazione del file in corso...",
    nl: "Bestand verwijderen...",
    pt: "Excluindo arquivo..."
  },
  SortByFilename: {
    en: "Sort by Filename",
    es: "Ordenar por Nombre de Archivo",
    fr: "Trier par Nom de Fichier",
    de: "Nach Dateiname sortieren",
    zh: "按文件名排序",
    ja: "ファイル名で並べ替え",
    ko: "파일명으로 정렬",
    it: "Ordina per Nome File",
    nl: "Sorteren op bestandsnaam",
    pt: "Ordenar por Nome do Arquivo"
  },
  SortByCreatedOn: {
    en: "Sort by Created On",
    es: "Ordenar por Fecha de Creación",
    fr: "Trier par Date de Création",
    de: "Nach Erstellungsdatum sortieren",
    zh: "按创建日期排序",
    ja: "作成日で並べ替え",
    ko: "생성 날짜별 정렬",
    it: "Ordina per Data di Creazione",
    nl: "Sorteren op aanmaakdatum",
    pt: "Ordenar por Data de Criação"
  },
  GridFilenameHeader: {
    en: "Filename",
    es: "Nombre de Archivo",
    fr: "Nom du Fichier",
    de: "Dateiname",
    zh: "文件名",
    ja: "ファイル名",
    ko: "파일명",
    it: "Nome File",
    nl: "Bestandsnaam",
    pt: "Nome do Arquivo"
  },
  GridCreatedOnHeader: {
    en: "Created On",
    es: "Creado en",
    fr: "Créé le",
    de: "Erstellt am",
    zh: "创建于",
    ja: "作成日",
    ko: "생성일",
    it: "Creato il",
    nl: "Gemaakt op",
    pt: "Criado em"
  },
  GridActionsOnHeader:{
    en: "Actions",
    es: "Acciones",
    fr: "Actions",
    de: "Aktionen",
    zh: "操作",
    ja: "アクション",
    ko: "작업",
    it: "Azioni",
    nl: "Acties",
    pt: "Ações"
  },
  GridLoading: {
    en: "Loading...",
    es: "Cargando...",
    fr: "Chargement...",
    de: "Laden...",
    zh: "加载中...",
    ja: "読み込み中...",
    ko: "로드 중...",
    it: "Caricamento in corso...",
    nl: "Laden...",
    pt: "Carregando..."
  },
  MaxFilesExceeded: {
    en: "You can only have a total of {allowedTotal} file(s). You already have {currentCount}, so you can only add {remaining} more.",
    es: "Solo puedes tener un total de {allowedTotal} archivo(s). Ya tienes {currentCount}, por lo que solo puedes agregar {remaining} más.",
    fr: "Vous ne pouvez avoir qu'un total de {allowedTotal} fichier(s). Vous en avez déjà {currentCount}, il ne vous reste que {remaining} à ajouter.",
    de: "Sie können insgesamt nur {allowedTotal} Datei(en) haben. Sie haben bereits {currentCount}, also können Sie nur noch {remaining} hinzufügen.",
    zh: "您最多只能有 {allowedTotal} 个文件。您已拥有 {currentCount} 个，因此只能再添加 {remaining} 个。",
    ja: "{allowedTotal} 個のファイルしか持てません。すでに {currentCount} 個あるので、あと {remaining} 個しか追加できません。",
    ko: "{allowedTotal} 개의 파일만 허용됩니다. 이미 {currentCount} 개가 있으므로, {remaining} 개만 추가할 수 있습니다.",
    it: "Puoi avere al massimo {allowedTotal} file. Ne hai già {currentCount}, quindi puoi aggiungerne solo altri {remaining}.",
    nl: "U kunt in totaal slechts {allowedTotal} bestand(en) hebben. U heeft er al {currentCount}, dus u kunt nog maar {remaining} toevoegen.",
    pt: "Você só pode ter um total de {allowedTotal} arquivo(s). Você já tem {currentCount}, então só pode adicionar {remaining} a mais."
  },
  OversizeFileError: {
    en: "The file \"{fileName}\" exceeds the maximum size of {maxSize} KB.",
    es: "El archivo \"{fileName}\" excede el tamaño máximo de {maxSize} KB.",
    fr: "Le fichier \"{fileName}\" dépasse la taille maximale de {maxSize} KB.",
    de: "Die Datei \"{fileName}\" überschreitet die maximale Größe von {maxSize} KB.",
    zh: "文件 \"{fileName}\" 超过了 {maxSize} KB 的最大尺寸。",
    ja: "ファイル \"{fileName}\" は最大サイズ {maxSize} KB を超えています。",
    ko: "파일 \"{fileName}\" 가 최대 크기 {maxSize} KB를 초과합니다.",
    it: "Il file \"{fileName}\" supera la dimensione massima di {maxSize} KB.",
    nl: "Het bestand \"{fileName}\" overschrijdt de maximale grootte van {maxSize} KB.",
    pt: "O arquivo \"{fileName}\" excede o tamanho máximo de {maxSize} KB."
  },
  OversizeFilesError: {
    en: "{count} files exceed the maximum size of {maxSize} KB.",
    es: "{count} archivos exceden el tamaño máximo de {maxSize} KB.",
    fr: "{count} fichiers dépassent la taille maximale de {maxSize} KB.",
    de: "{count} Dateien überschreiten die maximale Größe von {maxSize} KB.",
    zh: "{count} 个文件超过了 {maxSize} KB 的最大尺寸。",
    ja: "{count} 個のファイルが最大サイズ {maxSize} KB を超えています。",
    ko: "{count} 개의 파일이 최대 크기 {maxSize} KB를 초과합니다.",
    it: "{count} file superano la dimensione massima di {maxSize} KB.",
    nl: "{count} bestanden overschrijden de maximale grootte van {maxSize} KB.",
    pt: "{count} arquivos excedem o tamanho máximo de {maxSize} KB."
  },
  DisallowedFileError: {
    en: "You are attempting to upload {count} file(s) with disallowed file types/mime types. Please upload only allowed types.",
    es: "Estás intentando cargar {count} archivo(s) con tipos/mime no permitidos. Por favor, carga solo los tipos permitidos.",
    fr: "Vous tentez de télécharger {count} fichier(s) avec des types/mime non autorisés. Veuillez télécharger uniquement les types autorisés.",
    de: "Sie versuchen, {count} Datei(en) mit nicht erlaubten Dateitypen/MIME-Typen hochzuladen. Bitte laden Sie nur erlaubte Typen hoch.",
    zh: "您正在尝试上传 {count} 个不允许的文件类型/MIME 类型的文件。请仅上传允许的类型。",
    ja: "{count} 個の許可されていないファイルタイプ/MIMEタイプのファイルをアップロードしようとしています。許可されたタイプのみアップロードしてください。",
    ko: "{count} 개의 허용되지 않는 파일 유형/MIME 유형의 파일을 업로드하려고 합니다. 허용된 유형만 업로드하십시오.",
    it: "Stai tentando di caricare {count} file con tipi/MIME non consentiti. Carica solo i tipi permessi.",
    nl: "U probeert {count} bestand(en) met niet-toegestane bestandstypen/MIME-types te uploaden. Upload alleen toegestane types.",
    pt: "Você está tentando enviar {count} arquivo(s) com tipos/MIME não permitidos. Envie apenas os tipos permitidos."
  },
  DeleteSelected: {
    en: "Delete Selected",
    es: "Eliminar seleccionados",
    fr: "Supprimer sélectionnés",
    de: "Auswahl löschen",
    zh: "删除所选",
    ja: "選択項目を削除",
    ko: "선택한 항목 삭제",
    it: "Elimina selezionati",
    nl: "Selectie verwijderen",
    pt: "Excluir selecionados"
  },
  CancelUpload: {
    en: "Cancel Upload",
    es: "Cancelar carga",
    fr: "Annuler le téléchargement",
    de: "Upload abbrechen",
    zh: "取消上传",
    ja: "アップロードをキャンセル",
    ko: "업로드 취소",
    it: "Annulla caricamento",
    nl: "Upload annuleren",
    pt: "Cancelar upload"
  },
  HideFiles: {
    en: "Hide Files",
    es: "Ocultar archivos",
    fr: "Masquer les fichiers",
    de: "Dateien ausblenden",
    zh: "隐藏文件",
    ja: "ファイルを非表示にする",
    ko: "파일 숨기기",
    it: "Nascondi file",
    nl: "Bestanden verbergen",
    pt: "Ocultar arquivos"
  },
  ShowFiles: {
    en: "Show Files",
    es: "Mostrar archivos",
    fr: "Afficher les fichiers",
    de: "Dateien anzeigen",
    zh: "显示文件",
    ja: "ファイルを表示する",
    ko: "파일 표시",
    it: "Mostra file",
    nl: "Bestanden tonen",
    pt: "Mostrar arquivos"
  },
  ForSingle: {
    en: "a file here to upload",
    es: "un archivo aquí para cargar",
    fr: "un fichier ici à uploader",
    de: "eine Datei hier zum Hochladen",
    zh: "上传一个文件",
    ja: "アップロードするファイルをここに",
    ko: "업로드할 파일 하나",
    it: "un file qui da caricare",
    nl: "een bestand hier om te uploaden",
    pt: "um arquivo aqui para enviar"
  },
  FileOverwriteDialogTitle: {
    en: "Overwrite File",
    es: "Sobrescribir archivo",
    fr: "Écraser le fichier",
    de: "Datei überschreiben",
    zh: "覆盖文件",
    ja: "ファイルの上書き",
    ko: "파일 덮어쓰기",
    it: "Sovrascrivi file",
    nl: "Bestand overschrijven",
    pt: "Sobrescrever arquivo"
  },
  FileOverwriteDialogMessage: {
    en: "The file {fileName} already exists. Do you want to overwrite it?",
    es: "El archivo {fileName} ya existe. ¿Desea sobrescribirlo?",
    fr: "Le fichier {fileName} existe déjà. Voulez-vous l’écraser ?",
    de: "Die Datei {fileName} existiert bereits. Möchten Sie sie überschreiben?",
    zh: "文件 {fileName} 已经存在。是否覆盖？",
    ja: "ファイル {fileName} は既に存在します。上書きしますか？",
    ko: "{fileName} 파일이 이미 있습니다. 덮어쓰겠습니까?",
    it: "Il file {fileName} esiste già. Vuoi sovrascriverlo?",
    nl: "Het bestand {fileName} bestaat al. Wilt u het overschrijven?",
    pt: "O arquivo {fileName} já existe. Deseja sobrescrevê-lo?"
  },
  FileOverwriteDialogConfirm: {
    en: "Overwrite",
    es: "Sobrescribir",
    fr: "Écraser",
    de: "Überschreiben",
    zh: "覆盖",
    ja: "上書き",
    ko: "덮어쓰기",
    it: "Sovrascrivi",
    nl: "Overschrijven",
    pt: "Sobrescrever"
  },
  FileOverwriteDialogConfirmAll: {
    en: "Overwrite All",
    es: "Sobrescribir todo",
    fr: "Tout écraser",
    de: "Alles überschreiben",
    zh: "全部覆盖",
    ja: "すべて上書き",
    ko: "모두 덮어쓰기",
    it: "Sovrascrivi tutto",
    nl: "Alles overschrijven",
    pt: "Sobrescrever tudo"
  },
  FileOverwriteDialogCancel: {
    en: "Cancel",
    es: "Cancelar",
    fr: "Annuler",
    de: "Abbrechen",
    zh: "取消",
    ja: "キャンセル",
    ko: "취소",
    it: "Annulla",
    nl: "Annuleren",
    pt: "Cancelar"
  },
  DeleteConfirmation: {
    en: "Delete Confirmation",
    es: "Confirmación de eliminación",
    fr: "Confirmation de suppression",
    de: "Löschbestätigung",
    zh: "删除确认",
    ja: "削除確認",
    ko: "삭제 확인",
    it: "Conferma eliminazione",
    nl: "Verwijderbevestiging",
    pt: "Confirmação de exclusão"
  },
  DeleteConfirmationSingle: {
    en: "Are you sure you want to delete this file?",
    es: "¿Está seguro de que desea eliminar este archivo?",
    fr: "Voulez-vous vraiment supprimer ce fichier ?",
    de: "Möchten Sie diese Datei wirklich löschen?",
    zh: "确定删除此文件吗？",
    ja: "このファイルを削除してもよろしいですか？",
    ko: "이 파일을 삭제하시겠습니까?",
    it: "Sei sicuro di voler eliminare questo file?",
    nl: "Weet u zeker dat u dit bestand wilt verwijderen?",
    pt: "Tem certeza de que deseja excluir este arquivo?"
  },
  DeleteConfirmationMultiple: {
    en: "Are you sure you want to delete these {count} files?",
    es: "¿Está seguro de que desea eliminar estos {count} archivos?",
    fr: "Voulez-vous vraiment supprimer ces {count} fichiers ?",
    de: "Möchten Sie diese {count} Dateien wirklich löschen?",
    zh: "您确定要删除这 {count} 个文件吗？",
    ja: "これらの {count} 個のファイルを削除してもよろしいですか？",
    ko: "이 {count}개의 파일을 삭제하시겠습니까?",
    it: "Sei sicuro di voler eliminare questi {count} file?",
    nl: "Weet u zeker dat u deze {count} bestanden wilt verwijderen?",
    pt: "Tem certeza de que deseja excluir estes {count} arquivos?"
  },
  ConfirmDelete: {
    en: "Delete",
    es: "Eliminar",
    fr: "Supprimer",
    de: "Löschen",
    zh: "删除",
    ja: "削除",
    ko: "삭제",
    it: "Elimina",
    nl: "Verwijderen",
    pt: "Excluir"
  },
  Cancel: {
    en: "Cancel",
    es: "Cancelar",
    fr: "Annuler",
    de: "Abbrechen",
    zh: "取消",
    ja: "キャンセル",
    ko: "취소",
    it: "Annulla",
    nl: "Annuleren",
    pt: "Cancelar"
  },
  DismissError: {
    en: "Dismiss",
    es: "Cerrar",
    fr: "Fermer",
    de: "Schließen",
    zh: "关闭",
    ja: "閉じる",
    ko: "닫기",
    it: "Chiudi",
    nl: "Sluiten",
    pt: "Fechar"
  },
  GridFooterTotal: {
    en: "Total files: {total}",
    es: "Archivos totales: {total}",
    fr: "Fichiers totaux : {total}",
    de: "Gesamtdateien: {total}",
    zh: "总文件数: {total}",
    ja: "合計ファイル数: {total}",
    ko: "총 파일 수: {total}",
    it: "File totali: {total}",
    nl: "Totale bestanden: {total}",
    pt: "Total de arquivos: {total}"
  },
  GridFooterSelected: {
    en: " | {selected} (selected)",
    es: " | {selected} (seleccionado)",
    fr: " | {selected} (sélectionné)",
    de: " | {selected} (ausgewählt)",
    zh: " | {selected} (已选中)",
    ja: " | {selected} (選択済み)",
    ko: " | {selected} (선택됨)",
    it: " | {selected} (selezionato)",
    nl: " | {selected} (geselecteerd)",
    pt: " | {selected} (selecionado)"
  },
  DownloadButton: {
    en: "Download",
    es: "Descargar",
    fr: "Télécharger",
    de: "Herunterladen",
    zh: "下载",
    ja: "ダウンロード",
    ko: "다운로드",
    it: "Scarica",
    nl: "Downloaden",
    pt: "Baixar"
  },
  DeleteButton: {
    en: "Delete",
    es: "Eliminar",
    fr: "Supprimer",
    de: "Löschen",
    zh: "删除",
    ja: "削除",
    ko: "삭제",
    it: "Elimina",
    nl: "Verwijderen",
    pt: "Excluir"
  },
  MaxFilesAllowed: {
    en: "Maximum number of files allowed: {count}",
    es: "Número máximo de archivos permitidos: {count}",
    fr: "Nombre maximum de fichiers autorisés : {count}",
    de: "Maximale Anzahl an Dateien erlaubt: {count}",
    zh: "允许的最大文件数：{count}",
    ja: "許可されている最大ファイル数：{count}",
    ko: "허용되는 최대 파일 수: {count}",
    it: "Numero massimo di file consentiti: {count}",
    nl: "Maximaal aantal toegestane bestanden: {count}",
    pt: "Número máximo de arquivos permitidos: {count}"
  },
  MaxFileSizeAllowed: {
    en: "Maximum file size allowed per file is {size}",
    es: "El tamaño máximo de archivo permitido por archivo es {size}",
    fr: "La taille maximale de fichier autorisée par fichier est {size}",
    de: "Die maximale Dateigröße pro Datei beträgt {size}",
    zh: "每个文件允许的最大文件大小为 {size}",
    ja: "ファイルごとに許可される最大ファイルサイズは {size}",
    ko: "파일당 허용되는 최대 파일 크기는 {size}입니다.",
    it: "La dimensione massima del file consentita per file è {size}",
    nl: "De maximale bestandsgrootte per bestand is {size}",
    pt: "O tamanho máximo de arquivo permitido por arquivo é {size}"
  },
  FileErrorEmptyFile: {
    en: "This file is empty and cannot be uploaded.",
    es: "Este archivo está vacío y no se puede cargar.",
    fr: "Ce fichier est vide et ne peut pas être chargé.",
    de: "Diese Datei ist leer und kann nicht hochgeladen werden.",
    zh: "此文件为空，无法上传。",
    ja: "このファイルは空のためアップロードできません。",
    ko: "이 파일은 비어 있어 업로드할 수 없습니다.",
    it: "Questo file è vuoto e non può essere caricato.",
    nl: "Dit bestand is leeg en kan niet worden geüpload.",
    pt: "Este arquivo está vazio e não pode ser carregado."
  },
  FileErrorRecordNotFound: {
    en: "The record these files belong to could not be found. It may have been deleted.",
    es: "No se encontró el registro al que pertenecen estos archivos. Es posible que se haya eliminado.",
    fr: "L'enregistrement auquel ces fichiers appartiennent est introuvable. Il a peut-être été supprimé.",
    de: "Der Datensatz, zu dem diese Dateien gehören, wurde nicht gefunden. Möglicherweise wurde er gelöscht.",
    zh: "找不到这些文件所属的记录，它可能已被删除。",
    ja: "これらのファイルが属するレコードが見つかりません。削除された可能性があります。",
    ko: "이 파일이 속한 레코드를 찾을 수 없습니다. 삭제되었을 수 있습니다.",
    it: "Impossibile trovare il record a cui appartengono questi file. Potrebbe essere stato eliminato.",
    nl: "De record waartoe deze bestanden behoren is niet gevonden. Mogelijk is deze verwijderd.",
    pt: "Não foi possível encontrar o registro ao qual estes arquivos pertencem. Ele pode ter sido excluído."
  },
  FileErrorNoPermission: {
    en: "You do not have permission to do this. Contact your administrator if you need access.",
    es: "No tiene permiso para hacer esto. Póngase en contacto con su administrador si necesita acceso.",
    fr: "Vous n'avez pas l'autorisation d'effectuer cette action. Contactez votre administrateur si vous avez besoin d'un accès.",
    de: "Sie haben keine Berechtigung für diese Aktion. Wenden Sie sich an Ihren Administrator, wenn Sie Zugriff benötigen.",
    zh: "您没有执行此操作的权限。如需访问权限，请联系管理员。",
    ja: "この操作を行う権限がありません。アクセスが必要な場合は管理者にお問い合わせください。",
    ko: "이 작업을 수행할 권한이 없습니다. 액세스가 필요하면 관리자에게 문의하세요.",
    it: "Non si dispone dell'autorizzazione per eseguire questa operazione. Contattare l'amministratore se serve l'accesso.",
    nl: "U hebt geen toestemming om dit te doen. Neem contact op met uw beheerder als u toegang nodig hebt.",
    pt: "Você não tem permissão para fazer isso. Entre em contato com o administrador se precisar de acesso."
  },
  FileErrorTypeNotAllowed: {
    en: "This file type is not allowed.",
    es: "Este tipo de archivo no está permitido.",
    fr: "Ce type de fichier n'est pas autorisé.",
    de: "Dieser Dateityp ist nicht zulässig.",
    zh: "不允许此文件类型。",
    ja: "このファイル形式は許可されていません。",
    ko: "이 파일 형식은 허용되지 않습니다.",
    it: "Questo tipo di file non è consentito.",
    nl: "Dit bestandstype is niet toegestaan.",
    pt: "Este tipo de arquivo não é permitido."
  },
  FileErrorTooLarge: {
    en: "This file is too large to upload.",
    es: "Este archivo es demasiado grande para cargarlo.",
    fr: "Ce fichier est trop volumineux pour être chargé.",
    de: "Diese Datei ist zu groß zum Hochladen.",
    zh: "此文件过大，无法上传。",
    ja: "このファイルはサイズが大きすぎるためアップロードできません。",
    ko: "이 파일은 너무 커서 업로드할 수 없습니다.",
    it: "Questo file è troppo grande per essere caricato.",
    nl: "Dit bestand is te groot om te uploaden.",
    pt: "Este arquivo é grande demais para ser carregado."
  },
  FileErrorFileUnavailable: {
    en: "This file is no longer available. It may have already been deleted.",
    es: "Este archivo ya no está disponible. Es posible que ya se haya eliminado.",
    fr: "Ce fichier n'est plus disponible. Il a peut-être déjà été supprimé.",
    de: "Diese Datei ist nicht mehr verfügbar. Möglicherweise wurde sie bereits gelöscht.",
    zh: "此文件已不可用，可能已被删除。",
    ja: "このファイルは利用できません。既に削除された可能性があります。",
    ko: "이 파일은 더 이상 사용할 수 없습니다. 이미 삭제되었을 수 있습니다.",
    it: "Questo file non è più disponibile. Potrebbe essere già stato eliminato.",
    nl: "Dit bestand is niet meer beschikbaar. Mogelijk is het al verwijderd.",
    pt: "Este arquivo não está mais disponível. Ele pode já ter sido excluído."
  },
  FileErrorNotConfigured: {
    en: "File storage is not set up correctly for this site. Contact your administrator.",
    es: "El almacenamiento de archivos no está configurado correctamente para este sitio. Póngase en contacto con su administrador.",
    fr: "Le stockage de fichiers n'est pas configuré correctement pour ce site. Contactez votre administrateur.",
    de: "Der Dateispeicher ist für diese Website nicht richtig eingerichtet. Wenden Sie sich an Ihren Administrator.",
    zh: "此站点的文件存储配置不正确。请联系管理员。",
    ja: "このサイトのファイルストレージが正しく設定されていません。管理者にお問い合わせください。",
    ko: "이 사이트의 파일 저장소가 올바르게 설정되지 않았습니다. 관리자에게 문의하세요.",
    it: "L'archiviazione dei file non è configurata correttamente per questo sito. Contattare l'amministratore.",
    nl: "Bestandsopslag is niet juist ingesteld voor deze site. Neem contact op met uw beheerder.",
    pt: "O armazenamento de arquivos não está configurado corretamente para este site. Entre em contato com o administrador."
  },
  FileErrorUnexpected: {
    en: "Something went wrong while processing this file. Try again, and contact your administrator if it keeps happening.",
    es: "Algo salió mal al procesar este archivo. Vuelva a intentarlo y póngase en contacto con su administrador si el problema continúa.",
    fr: "Une erreur s'est produite lors du traitement de ce fichier. Réessayez et contactez votre administrateur si le problème persiste.",
    de: "Bei der Verarbeitung dieser Datei ist ein Fehler aufgetreten. Versuchen Sie es erneut und wenden Sie sich an Ihren Administrator, wenn das Problem weiterhin besteht.",
    zh: "处理此文件时出错。请重试，如果问题持续存在，请联系管理员。",
    ja: "このファイルの処理中に問題が発生しました。もう一度お試しください。解決しない場合は管理者にお問い合わせください。",
    ko: "이 파일을 처리하는 중 문제가 발생했습니다. 다시 시도하고 문제가 계속되면 관리자에게 문의하세요.",
    it: "Si è verificato un problema durante l'elaborazione di questo file. Riprovare e contattare l'amministratore se il problema persiste.",
    nl: "Er is iets misgegaan bij het verwerken van dit bestand. Probeer het opnieuw en neem contact op met uw beheerder als het probleem aanhoudt.",
    pt: "Ocorreu um problema ao processar este arquivo. Tente novamente e entre em contato com o administrador se o problema continuar."
  },
  LoadFilesFailed: {
    en: "The files could not be loaded.",
    es: "No se pudieron cargar los archivos.",
    fr: "Impossible de charger les fichiers.",
    de: "Die Dateien konnten nicht geladen werden.",
    zh: "无法加载文件。",
    ja: "ファイルを読み込めませんでした。",
    ko: "파일을 불러올 수 없습니다.",
    it: "Impossibile caricare i file.",
    nl: "De bestanden konden niet worden geladen.",
    pt: "Não foi possível carregar os arquivos."
  },
  CheckExistingFilesFailed: {
    en: "The existing files could not be checked.",
    es: "No se pudieron comprobar los archivos existentes.",
    fr: "Impossible de vérifier les fichiers existants.",
    de: "Die vorhandenen Dateien konnten nicht überprüft werden.",
    zh: "无法检查现有文件。",
    ja: "既存のファイルを確認できませんでした。",
    ko: "기존 파일을 확인할 수 없습니다.",
    it: "Impossibile controllare i file esistenti.",
    nl: "De bestaande bestanden konden niet worden gecontroleerd.",
    pt: "Não foi possível verificar os arquivos existentes."
  },
  UploadFileFailed: {
    en: "{fileName} could not be uploaded.",
    es: "No se pudo cargar {fileName}.",
    fr: "Impossible de charger {fileName}.",
    de: "{fileName} konnte nicht hochgeladen werden.",
    zh: "无法上传 {fileName}。",
    ja: "{fileName} をアップロードできませんでした。",
    ko: "{fileName}을(를) 업로드할 수 없습니다.",
    it: "Impossibile caricare {fileName}.",
    nl: "{fileName} kon niet worden geüpload.",
    pt: "Não foi possível carregar {fileName}."
  }
};

export type TranslationKey = keyof TranslationParams;

export function getTranslation<K extends TranslationKey>(
  key: K,
  language: LanguageCode,
  params?: TranslationParams[K]
): string {
  const entry = translations[key];
  let text = (entry && entry[language]) || translations[key]?.en || key;
  if (params) {
    text = text.replace(/{(\w+)}/g, (_: string, paramName: string) =>
      params && (params as Record<string, unknown>)[paramName] !== undefined ? String((params as Record<string, unknown>)[paramName]) : `{${paramName}}`
    );
  }
  return text;
}
