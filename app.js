import { upload } from './upload.js';
import { firebaseConfig } from './config.js';
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const firebaseApp = initializeApp(firebaseConfig);
const storage     = getStorage(firebaseApp);

upload('#file', {
    multi: true,
    accept: [
        '.jpg',
        '.jpeg',
        '.png',
    ],
    uploader(files, blocks) {
        files.forEach((file, index) => {
            const storageRef = ref(storage, `images/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef,file);

            uploadTask.on('state_changed', 
                snapshot => {
                    const block      = blocks[index].querySelector('.preview-info_progress');
                    const percentage = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0);
                    
                    block.textContent = `${percentage}%`;
                    block.style.width = percentage + '%';
                },
                error => {},
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        console.log('File available at', downloadURL);
                    });
                }
            )
        });
    }
});