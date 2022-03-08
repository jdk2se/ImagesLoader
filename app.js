import {upload} from './upload.js';

upload('#file', {
    multi: true,
    accept: [
        '.jpg',
        '.jpeg',
        '.png',
    ],
    uploader(files) {

    }
});