function bytesToSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) {
        return '0 Byte';
    }    
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
 }

const createElement = (tag, classes = [], content) => {
    const node = document.createElement(tag);
    if (classes.length) {
       node.classList.add(...classes);
    }

    if (content) {
        node.textContent = content;
    }

    return node;
}

const clearPreview = (el) => {
    el.innerHTML    = '<div class="preview-info_progress"></div>';
    el.style.bottom = 0;
}

export function upload(selector, options = {}) {
    let   files    = [];
    const uploader = options.uploader ?? (() => {});
    const input    = document.querySelector(selector);
    const preview  = createElement('div', ['preview']);

    preview.addEventListener('click', ev => {
        if (!ev.target?.dataset?.name) {
            return;
        }

        const {name} = ev.target.dataset;
        files = files.filter(file => file.name !== name);

        if (!files.length) {
            uploadBtn.classList.add('hidden');
        }

        const block = preview
            .querySelector(`[data-name="${name}"`)
            .closest('.preview-img');

        block.classList.add('removing');
        setTimeout(() => {
            block.remove();
        }, 300);
    });

    const openBtn   = createElement('button', ['button'], 'Open');
    const uploadBtn = createElement('button', ['button', 'primary', 'hidden'], 'Upload');

    if (options.multi) {
        input.setAttribute('multiple', true);
    }

    if (options.accept && Array.isArray(options.accept)) {
        input.setAttribute('accept', options.accept.join(','));
    }

    input.insertAdjacentElement('afterend', uploadBtn);
    input.insertAdjacentElement('afterend', openBtn);
    input.insertAdjacentElement('afterend', preview);

    const triggerInput = () => input.click();

    const changeHandler = event => {
        if (!event.target.files.length) {
            return;
        }

        files = Array.from(event.target.files);

        preview.innerHTML = '';
        uploadBtn.classList.remove('hidden');

        files.forEach(file => {
            if (!file.type.match('image')) {
                return;
            }

            const reader = new FileReader();

            reader.onload = ev => {
                const src = ev.target.result;
                preview.insertAdjacentHTML('afterbegin', `
                    <div class = "preview-img">
                    <div class = "preview-delete" data-name = "${file.name}">&times;</div>
                    <img src   = "${src}" alt               = ${file.name}>
                    <div class = "preview-info">
                            <span>${file.name}</span>
                            <span>${bytesToSize(file.size)}</span>
                        </div>
                    </div>    
                `);
            }

            reader.readAsDataURL(file);
        });
    };

    const uploadHandler = () => {
        preview.querySelectorAll('.preview-delete')
            .forEach(el => el.remove());
        const previewInfo = preview.querySelectorAll('.preview-info');
        previewInfo.forEach(clearPreview);
        uploader(files);
    }

    openBtn.addEventListener('click', triggerInput);
    input.addEventListener('change', changeHandler);
    uploadBtn.addEventListener('click', uploadHandler);
}