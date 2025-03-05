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
  MaxFileSizeAllowed = "MaxFileSizeAllowed"
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
    ko: "폴더 업로드는 허용되지 않습니다. 파일만 선택하십시오。",
    it: "Non è possibile caricare cartelle. Seleziona solo file.",
    nl: "Het uploaden van mappen is niet toegestaan. Selecteer alleen bestanden.",
    pt: "O upload de pastas não é permitido. Por favor, selecione apenas arquivos。"
  },
  DeleteAnnotationFailed: {
    en: "Failed to delete annotation.",
    es: "No se pudo eliminar la anotación。",
    fr: "La suppression de l'annotation a échoué。",
    de: "Löschen der Annotation fehlgeschlagen。",
    zh: "删除批注失败。",
    ja: "注釈の削除に失敗しました。",
    ko: "주석 삭제에 실패했습니다。",
    it: "Impossibile eliminare l'annotazione。",
    nl: "Het verwijderen van de annotatie is mislukt。",
    pt: "Falha ao excluir a anotação。"
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
    es: "No se pudo eliminar el archivo。",
    fr: "La suppression du fichier a échoué。",
    de: "Löschen der Datei fehlgeschlagen。",
    zh: "删除文件失败。",
    ja: "ファイルの削除に失敗しました。",
    ko: "파일 삭제에 실패했습니다。",
    it: "Impossibile eliminare il file。",
    nl: "Het verwijderen van het bestand is mislukt。",
    pt: "Falha ao excluir o arquivo。"
  },
  DeleteDuplicateAnnotationsFailed: {
    en: "Failed to delete duplicate annotations.",
    es: "No se pudieron eliminar las anotaciones duplicadas。",
    fr: "La suppression des annotations dupliquées a échoué。",
    de: "Löschen der doppelten Annotationen fehlgeschlagen。",
    zh: "删除重复批注失败。",
    ja: "重複する注釈の削除に失敗しました。",
    ko: "중복된 주석 삭제에 실패했습니다。",
    it: "Impossibile eliminare le annotazioni duplicate。",
    nl: "Het verwijderen van dubbele annotaties is mislukt。",
    pt: "Falha ao excluir anotações duplicadas。"
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
    es: "Solo puedes tener un total de {allowedTotal} archivo(s). Ya tienes {currentCount}, por lo que solo puedes agregar {remaining} más。",
    fr: "Vous ne pouvez avoir qu'un total de {allowedTotal} fichier(s). Vous en avez déjà {currentCount}, il ne vous reste que {remaining} à ajouter。",
    de: "Sie können insgesamt nur {allowedTotal} Datei(en) haben. Sie haben bereits {currentCount}, also können Sie nur noch {remaining} hinzufügen。",
    zh: "您最多只能有 {allowedTotal} 个文件。您已拥有 {currentCount} 个，因此只能再添加 {remaining} 个。",
    ja: "{allowedTotal} 個のファイルしか持てません。すでに {currentCount} 個あるので、あと {remaining} 個しか追加できません。",
    ko: "{allowedTotal} 개의 파일만 허용됩니다. 이미 {currentCount} 개가 있으므로, {remaining} 개만 추가할 수 있습니다。",
    it: "Puoi avere al massimo {allowedTotal} file. Ne hai già {currentCount}, quindi puoi aggiungerne solo altri {remaining}。",
    nl: "U kunt in totaal slechts {allowedTotal} bestand(en) hebben. U heeft er al {currentCount}, dus u kunt nog maar {remaining} toevoegen。",
    pt: "Você só pode ter um total de {allowedTotal} arquivo(s). Você já tem {currentCount}, então só pode adicionar {remaining} a mais。"
  },
  OversizeFileError: {
    en: "The file \"{fileName}\" exceeds the maximum size of {maxSize} KB。",
    es: "El archivo \"{fileName}\" excede el tamaño máximo de {maxSize} KB。",
    fr: "Le fichier \"{fileName}\" dépasse la taille maximale de {maxSize} KB。",
    de: "Die Datei \"{fileName}\" überschreitet die maximale Größe von {maxSize} KB。",
    zh: "文件 \"{fileName}\" 超过了 {maxSize} KB 的最大尺寸。",
    ja: "ファイル \"{fileName}\" は最大サイズ {maxSize} KB を超えています。",
    ko: "파일 \"{fileName}\" 가 최대 크기 {maxSize} KB를 초과합니다。",
    it: "Il file \"{fileName}\" supera la dimensione massima di {maxSize} KB。",
    nl: "Het bestand \"{fileName}\" overschrijdt de maximale grootte van {maxSize} KB。",
    pt: "O arquivo \"{fileName}\" excede o tamanho máximo de {maxSize} KB。"
  },
  OversizeFilesError: {
    en: "{count} files exceed the maximum size of {maxSize} KB。",
    es: "{count} archivos exceden el tamaño máximo de {maxSize} KB。",
    fr: "{count} fichiers dépassent la taille maximale de {maxSize} KB。",
    de: "{count} Dateien überschreiten die maximale Größe von {maxSize} KB。",
    zh: "{count} 个文件超过了 {maxSize} KB 的最大尺寸。",
    ja: "{count} 個のファイルが最大サイズ {maxSize} KB を超えています。",
    ko: "{count} 개의 파일이 최대 크기 {maxSize} KB를 초과합니다。",
    it: "{count} file superano la dimensione massima di {maxSize} KB。",
    nl: "{count} bestanden overschrijden de maximale grootte van {maxSize} KB。",
    pt: "{count} arquivos excedem o tamanho máximo de {maxSize} KB。"
  },
  DisallowedFileError: {
    en: "You are attempting to upload {count} file(s) with disallowed file types/mime types. Please upload only allowed types。",
    es: "Estás intentando cargar {count} archivo(s) con tipos/mime no permitidos. Por favor, carga solo los tipos permitidos。",
    fr: "Vous tentez de télécharger {count} fichier(s) avec des types/mime non autorisés. Veuillez télécharger uniquement les types autorisés。",
    de: "Sie versuchen, {count} Datei(en) mit nicht erlaubten Dateitypen/MIME-Typen hochzuladen. Bitte laden Sie nur erlaubte Typen hoch。",
    zh: "您正在尝试上传 {count} 个不允许的文件类型/MIME 类型的文件。请仅上传允许的类型。",
    ja: "{count} 個の許可されていないファイルタイプ/MIMEタイプのファイルをアップロードしようとしています。許可されたタイプのみアップロードしてください。",
    ko: "{count} 개의 허용되지 않는 파일 유형/MIME 유형의 파일을 업로드하려고 합니다。 허용된 유형만 업로드하십시오。",
    it: "Stai tentando di caricare {count} file con tipi/MIME non consentiti。 Carica solo i tipi permessi。",
    nl: "U probeert {count} bestand(en) met niet-toegestane bestandstypen/MIME-types te uploaden。 Upload alleen toegestane types。",
    pt: "Você está tentando enviar {count} arquivo(s) com tipos/MIME não permitidos。 Envie apenas os tipos permitidos。"
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
    en: "Maxium file size allowed per file is {size}",
    es: "El tamaño máximo de archivo permitido por archivo es {size}",
    fr: "La taille maximale de fichier autorisée par fichier est {size}",
    de: "Die maximale Dateigröße pro Datei beträgt {size}",
    zh: "每个文件允许的最大文件大小为 {size}",
    ja: "ファイルごとに許可される最大ファイルサイズは {size}",
    ko: "파일당 허용되는 최대 파일 크기는 {size}입니다.",
    it: "La dimensione massima del file consentita per file è {size}",
    nl: "De maximale bestandsgrootte per bestand is {size}",
    pt: "O tamanho máximo de arquivo permitido por arquivo é {size}"
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
