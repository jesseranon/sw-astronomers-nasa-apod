const DATE = document.querySelector('#date-input');
const GET_PIC = document.querySelector('.get-pic');
const TODAY = new Date();
const TODAY_STRING = TODAY.toISOString().slice(0,10);
const CAROUSEL_BUTTONS = document.querySelector('.carousel__buttons');

DATE.setAttribute('max', TODAY_STRING);

window.addEventListener('DOMContentLoaded', () => {
    const app = new App(TODAY_STRING);
    app.init();
});
//
class App {
    constructor(today) {
        this._url = `/.netlify/functions/fetch-apod?date`;
        this._pictures = [];
        this._today = today;
        this._current = null;
    }

    init() {
        GET_PIC.addEventListener('click', async e => {
            let date = DATE.value;
            if (date == '') date = this._today;
            this._current = date;
            const data = await this.getFetch(this._current);
            
            this.renderApod(data);
            this.hideShowCarouselButtons(this._current);
        });
        CAROUSEL_BUTTONS.addEventListener('click', async e => {
            const button = e.target.closest('button');
            await this.prevNextApod(button.id);
        });
        console.log(this._today);
    }

    async getFetch(dateString) {
        try {
            const res = await fetch(`${this._url}=${dateString}`);
            const data = await res.json();
            console.log(data);
            const apod = new Apod(data);
            this._pictures.push(apod);
            return apod;
        } catch (error) {
                console.log(error);
        }
    }

    renderApod(obj) {
        document.querySelector('.carousel__container').classList.remove('hidden');

        const container = document.querySelector('.carousel__cards');
        container.textContent = '';

        const apodCard = document.createElement('li');
        apodCard.classList.add('apod-card');
        
        // const media = this.renderApodMedia(obj);
        // apodCard.appendChild(media);

        const media = this.renderApodMedia(obj);
        apodCard.appendChild(media);

        const info = document.createElement('div');
        info.classList.add('apod-info');

        const name = document.createElement('h2');
        name.textContent = obj._title;
        info.appendChild(name);

        const author = document.createElement('h3');
        if (obj._author) author.textContent = this.renderApodAuthor(obj._author);
        else author.textContent = "Unattributed";
        info.appendChild(author);

        const date = document.createElement('span');
        date.textContent = obj._date;
        info.appendChild(date);

        const description = document.createElement('p');
        description.textContent = obj._description;
        info.appendChild(description);

        apodCard.appendChild(info);

        document.querySelector('.carousel__cards').appendChild(apodCard);
    }

    renderApodAuthor(str) {
        let res = str;
        if (res.includes('\n')) res = res.replace('\n', ' & ');
        return res;
    }

    renderApodMedia(obj) {
        //if image, render image
        //if video, render video
        let outerContainer = document.createElement('div');
        outerContainer.classList.add('apod-media-outer');

        let mediaContainer = document.createElement('div');
        mediaContainer.classList.add('apod-media-container');

        let media;
        if (obj._mediaType === 'image') {
            console.log(obj._media);
            mediaContainer.style.backgroundImage = `url("${obj._media}")`
        } else {
            mediaContainer.style.backgroundImage = 'none';
            media = document.createElement('iFrame');
            media.src = obj._media;
            mediaContainer.appendChild(media);
        }

        outerContainer.appendChild(mediaContainer);
        return outerContainer;
    }

    hideShowCarouselButtons(dateString) {
        console.log('hit the hide show carousel buttons function');
        //if chosen date is today
        // hide next button
        //if chosen date is 1995-06-16
        // hide previous button
        const prevBtn = document.querySelector('#carousel__button-previous');
        const nextBtn = document.querySelector('#carousel__button-next');
        console.log(dateString === this._today);
        if (dateString === this._today) {
            nextBtn.classList.add('btn-disabled');
            console.log(nextBtn.classList);
        }
        else if (dateString === '1995-06-16') {
            prevBtn.classList.add('btn-disabled');
            console.log(prevBtn);
        } else {
            const disabledBtns = Array.from(document.querySelectorAll('.btn-disabled'))
            if (disabledBtns.length > 0) {
                disabledBtns.forEach(btn => btn.classList.remove('btn-disabled'));
            }
        }
    }

    async prevNextApod(buttonId) {
        let viewingDate = new Date(this._current);
        if (buttonId === 'carousel__button-next') {
            viewingDate.setDate(viewingDate.getDate() + 1);
            viewingDate = viewingDate.toISOString().slice(0,10);
        } else {
            viewingDate.setDate(viewingDate.getDate() - 1);
            viewingDate = viewingDate.toISOString().slice(0,10);
        }
        this._current = viewingDate
        const data = await this.getFetch(this._current);
        this.renderApod(data);
        this.hideShowCarouselButtons(this._current);
         // works! shows next day in YYYY-MM-DD format
        //if next btn is clicked
        // add 1 to date,
        //if prev btn is clicked
        // remove 1 from date
        //fetch apod

    }
}

class Apod {
    constructor({copyright, date, explanation, hdurl, media_type, service_version, title, url}) {
        this._author = copyright;
        this._date = date;
        this._description = explanation;
        this._media = url;
        this._hdMedia = hdurl,
        this._mediaType = media_type;
        this._title = title;
    }
    
    get get() {
        return this;
    }
}