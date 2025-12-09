const container = document.querySelector('.container');

function addsquare (size) {

    for (let i = 0; i < size * size; i++) {
        const square = document.createElement('div');
        container.appendChild(square);
    }
}