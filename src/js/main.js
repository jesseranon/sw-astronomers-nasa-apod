const DATE = document.querySelector('#date-input');
const GET_PIC = document.querySelector('.get-pic');

GET_PIC.addEventListener('click', async e => {
    const date = DATE.value;
    const url = `/.netlify/functions/fetch-apod?date=${date}`;
    
    try {
        const res = await fetch(url);
        const data = await res.json();
        console.log(data)
    
} catch (error) {
        console.log(error);
    }
});
