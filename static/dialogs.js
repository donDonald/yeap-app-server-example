'use strict';

// https://stackoverflow.com/questions/26150232/resolve-javascript-promise-outside-function-scope
class DeferredPromise {
    constructor() {
        this._promise = new Promise((resolve, reject) => {
            // assign the resolve and reject functions to `this`
            // making them usable on the class instance
            this.resolve = resolve;
            this.reject = reject;
        });
        // bind `then` and `catch` to implement the same interface as Promise
        this.then = this._promise.then.bind(this._promise);
        this.catch = this._promise.catch.bind(this._promise);
        this.finally = this._promise.finally.bind(this._promise);
        this[Symbol.toStringTag] = 'Promise';
    }
}



class Dialog {
    constructor(elementId) {
        this.dialog = $(`#${elementId}`);

        // Setup close button
        this._closeBtn = this.dialog.find('.dialog_close_btn');
        this._closeBtn.click(()=>{
            console.log('DialogExec._closeBtn.click()');
            if (this._promise) {
                console.log('DialogExec._closeBtn.click, resolving promise');
                this._promise.resolve('Closed');
                this._promise = undefined;
            }
            this.hide();
        });
    }

    setHeaderText(text) {
        const e = this.dialog.find('.dialog_header_text');
        if (e) {
            e.text(text);
        }
    }

    hide() {
        this.dialog.hide();
    }

    show() {
        this.dialog.show();
    }

    run(opts) {
        throw new Error('No way, Dialog.run is abstract!');
    }
}



class DialogExec extends Dialog {
    constructor(elementId) {
        super(elementId);

        // Setup exec button
        this._execBtn = this.dialog.find('.dialog_footer .btn');
        this._execBtn.click(()=>{
            this.exec()
                .then((result)=>{
                    this._promise.resolve(result);
                })
                .catch((err)=>{
                    this._promise.reject(err);
                })
                .finally(this.hide.bind(this));
        });
    }

    run() {
        throw new Error('No way, DialogExec.run is abstract!');
    }

    exec() {
        throw new Error('No way, DialogExec.exec is abstract!');
    }
}



class DialogFailure extends Dialog {
    constructor() {
        super('id_dialog_failure');
    }

    run(opts) {
        this.setHeaderText('Error');
        this.dialog.find('.dialog_content').text(opts.text);
        this.show();

        this._promise = new DeferredPromise();
        this._promise.resolve();
        return this._promise;
    }
}

