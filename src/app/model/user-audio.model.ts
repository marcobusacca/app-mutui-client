import { SafeUrl } from "@angular/platform-browser"

export class UserAudio {
    constructor(
        private file: File,
        private url: SafeUrl
    ) { }
}