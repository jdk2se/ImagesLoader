function bytesToSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) {
        return '0 Byte';
    }    
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
 }

export function upload(selector, options = {}) {
    let   files   = [];
    const input   = document.querySelector(selector);
    const preview = document.createElement('div');
    preview.classList.add('preview');

    preview.addEventListener('click', ev => {
        if (!ev.target?.dataset?.name) {
            return;
        }

        const {name} = ev.target.dataset;
        files = files.filter(file => file.name !== name);

        const block = preview
            .querySelector(`[data-name="${name}"`)
            .closest('.preview-img');

        block.classList.add('removing');
        setTimeout(() => {
            block.remove();
        }, 300);
    });

    const openBtn = document.createElement('button');
    openBtn.classList.add('button');
    openBtn.textContent = 'Open';

    if (options.multi) {
        input.setAttribute('multiple', true);
    }

    if (options.accept && Array.isArray(options.accept)) {
        input.setAttribute('accept', options.accept.join(','));
    }

    input.insertAdjacentElement('afterend', openBtn);
    input.insertAdjacentElement('afterend', preview);

    const triggerInput  = () => input.click();

    const changeHandler = event => {
        if (!event.target.files.length) {
            return;
        }

        files = Array.from(event.target.files);

        preview.innerHTML = '';
        files.forEach(file => {
            if (!file.type.match('image')) {
                return;
            }

            const reader = new FileReader();

            reader.onload = ev => {
                const src = ev.target.result;
                preview.insertAdjacentHTML('afterbegin', `
                    <div class="preview-img">
                        <div class="preview-delete" data-name="${file.name}">&times;</div>
                        <img src="${src}" alt=${file.name}>
                        <div class="preview-info">
                            <span>${file.name}</span>
                            <span>${bytesToSize(file.size)}</span>
                        </div>
                    </div>    
                `);
            }

            reader.readAsDataURL(file);
        });
    };

    openBtn.addEventListener('click', triggerInput);
    input.addEventListener('change', changeHandler);
}