import {
    ClassicEditor,
    Alignment,
    Autoformat,
    BlockQuote,
    Bold,
    Code,
    CodeBlock,
    Essentials,
    FontBackgroundColor,
    FontColor,
    FontFamily,
    FontSize,
    Heading,
    Highlight,
    HorizontalLine,
    Image,
    ImageInsert,
    ImageResize,
    ImageStyle,
    ImageToolbar,
    ImageUpload,
    Indent,
    IndentBlock,
    Italic,
    Link,
    List,
    Paragraph,
    PasteFromOffice,
    RemoveFormat,
    Table,
    TableCellProperties,
    TableProperties,
    TableToolbar,
    Underline,
} from "ckeditor5";
import type { EditorConfig } from "ckeditor5";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { FieldProps } from "formik";
import useHooks from "../../../hooks/useHooks.tsx";
import { api, helpers } from "../../../services/index.ts";
import { get } from "lodash";
import "ckeditor5/ckeditor5.css";
import "./dark.css";

interface Props extends FieldProps {
    disabled?: boolean;
    placeholder?: string;
    rootClassName?: string;
}

class CKUploadAdapter {
    private loader: any;
    constructor(loader: any) { this.loader = loader; }
    upload() {
        return this.loader.file.then((file: File) => {
            const formData = new FormData();
            formData.append("files[0]", file);
            return api({
                method: "post",
                url: "/files",
                data: formData,
                headers: { "Content-Type": "multipart/form-data" },
            }).then((res) => ({ default: get(res, "data.data[0].src") }));
        });
    }
    abort() { }
}

function CKUploadAdapterPlugin(editor: any) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader: any) =>
        new CKUploadAdapter(loader);
}

/** Birlashgan ckeditor5 paketidan yig'ilgan editor — ImageResize bilan */
class EduEditor extends ClassicEditor {
    static builtinPlugins = [
        Essentials, Paragraph, Heading,
        Bold, Italic, Underline, Link, List, Indent, IndentBlock,
        BlockQuote, Code, CodeBlock,
        Alignment, FontColor, FontBackgroundColor, FontSize, FontFamily, Highlight,
        HorizontalLine, RemoveFormat, Autoformat, PasteFromOffice,
        Image, ImageToolbar, ImageStyle, ImageUpload, ImageInsert, ImageResize,
        Table, TableToolbar, TableProperties, TableCellProperties,
    ];
}

function Index(props: Props) {
    const {
        form: { setFieldValue, setFieldTouched, errors, touched },
        field: { name, value },
        disabled,
        placeholder,
        rootClassName = "",
    } = props;

    const { t } = useHooks();
    const errorValue = helpers.getNestedValue(errors, name);
    const touchedError = helpers.getNestedValue(touched, name);


    const config: EditorConfig = {
        heading: {
            options: [
                { model: "paragraph", title: "Paragraph", class: "ck-heading_paragraph" },
                { model: "heading1", view: "h1", title: "Heading 1", class: "ck-heading_heading1" },
                { model: "heading2", view: "h2", title: "Heading 2", class: "ck-heading_heading2" },
                { model: "heading3", view: "h3", title: "Heading 3", class: "ck-heading_heading3" },
                { model: "heading4", view: "h4", title: "Heading 4", class: "ck-heading_heading4" },
                { model: "heading5", view: "h5", title: "Heading 5", class: "ck-heading_heading5" },
                { model: "heading6", view: "h6", title: "Heading 6", class: "ck-heading_heading6" },
            ] as any,
        },
        extraPlugins: [CKUploadAdapterPlugin],
        toolbar: {
            items: [
                "heading", "|",
                "bold", "italic", "underline", "link", "|",
                "bulletedList", "numberedList", "|",
                "indent", "outdent", "|",
                "imageUpload", "blockQuote", "insertTable", "code", "codeBlock", "|",
                "alignment", "fontColor", "fontBackgroundColor", "fontSize", "fontFamily", "highlight", "|",
                "horizontalLine", "removeFormat", "|",
                "undo", "redo",
            ],
            shouldNotGroupWhenFull: true,
        },
        image: {
            // Rasm bosilganda: o'lcham tutqichlari (burchaklardan sudrash) + pastdagi toolbar
            resizeUnit: "%",
            resizeOptions: [
                { name: "resizeImage:original", value: null, label: t("Asl o'lcham") },
                { name: "resizeImage:25", value: "25", label: "25%" },
                { name: "resizeImage:50", value: "50", label: "50%" },
                { name: "resizeImage:75", value: "75", label: "75%" },
            ],
            toolbar: [
                "imageTextAlternative", "|",
                "imageStyle:alignLeft", "imageStyle:block", "imageStyle:alignRight", "|",
                "resizeImage",
            ],
        },
        table: {
            contentToolbar: ["tableColumn", "tableRow", "mergeTableCells", "tableCellProperties", "tableProperties"],
        },
        placeholder,
        link: {
            decorators: {
                openInNewTab: {
                    mode: "manual",
                    label: t("Yangi tabda ochish"),
                    attributes: { target: "_blank", rel: "noopener noreferrer" },
                },
            },
        },
    };

    return (
        <div className={[rootClassName, !value && touchedError && errorValue ? "[&_.ck-content]:!border-[red]" : ""].filter(Boolean).join(" ")}>
            <CKEditor
                disabled={disabled}
                // @ts-ignore
                editor={EduEditor}
                config={config as any}

                onBlur={() => setFieldTouched(name, true)}
                data={value === undefined || value === null ? "" : value}
                onChange={(_: any, editor: any) => setFieldValue(name, editor.getData())}
            />

        </div>
    );
}

export default Index;
