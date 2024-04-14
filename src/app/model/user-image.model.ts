import { SafeUrl } from "@angular/platform-browser"

export class UserImage {
    constructor(
        private file: File,
        private url: SafeUrl
    ) { }
}