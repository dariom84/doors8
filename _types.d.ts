import { Session, Document, Folder } from './_types/doorsapi2.mjs';

declare global {
    var dSession : Session;
    var doc : Document;
    var folder : Folder;
}