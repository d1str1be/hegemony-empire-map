// get the viewport height and multiply it by 1% to get a value for a vh unit
let vh = window.innerHeight * 0.01;
// set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty('--vh', `${vh}px`);

const map = document.getElementById('map')
const mapImg = document.getElementById('map__img')
const menu = document.getElementById('menu')
//const moves_default = document.getElementById('menu__moves')
const moves_dropdown = document.getElementById('turns_buttons')

mapImg.setAttribute('src', getURL('Полит.карта'))
moves_dropdown.style.visibility = 'hidden'

// zoom functionality
let scale = 1;
function zoom(event) {
    scale += event.deltaY * -0.001
    // Restrict scale
    scale = Math.min(Math.max(0.5, scale), 4)
    // Apply scale transform
    map.style.transform = `scale(${scale})`
}


// Pan Functionality
let img_ele = null
let x_cursor = 0
let y_cursor = 0
let x_img_ele = 0
let y_img_ele = 0

function start_drag(event) {
    img_ele = this;
    if (event.type == 'mousedown') {
        x_img_ele = window.event.clientX - mapImg.offsetLeft
        y_img_ele = window.event.clientY - mapImg.offsetTop
    } else if (event.type == 'touchstart') {
        let touch = event.touches[0] || event.changedTouches[0]
        x_img_ele = touch.clientX - mapImg.offsetLeft
        y_img_ele = touch.clientY - mapImg.offsetTop
    }
}

function stop_drag() {
    img_ele = null
}

function while_drag(event) {
    if (event.type == 'mousemove') {
        x_cursor = window.event.clientX
        y_cursor = window.event.clientY
    } else if (event.type = 'touchmove') {
        let touch = event.touches[0] || event.changedTouches[0]
        x_cursor = touch.clientX
        y_cursor = touch.clientY
    }
    if (img_ele !== null) {
        img_ele.style.left = (x_cursor - x_img_ele) + 'px'
        img_ele.style.top = (y_cursor - y_img_ele) + 'px'
        //track movement in console
        //console.log(img_ele.style.left+' - '+img_ele.style.top)

    }
}

// enable pan
mapImg.addEventListener('mousedown', start_drag)
map.addEventListener('mousemove', while_drag)
map.addEventListener('mouseup', stop_drag)
mapImg.addEventListener('touchstart', start_drag)
map.addEventListener('touchmove', while_drag)
map.addEventListener('touchend', stop_drag)
// enable zoom
map.onwheel = zoom
// disable right-click the image
mapImg.addEventListener('contextmenu', event => event.preventDefault())




// UI - Buttons
let moveID = 1

function getURL(key) {
    let url = ''
    let keys = {
		'Полит.карта': 'images/Politkarta_1700.png',
        'Рассадка': 'images/Politkarta_1700_rassadka_v2.png',
        'LVL пров.': 'images/Plotnost_nasel_1700.png',
        'Климат': 'images/Klimat_1700.png',
        'Этнос': 'images/Etnokarta_1700.png',
        'Ландшафт': 'images/Landshaft_1700.png',
		'Ресурсы пров.': 'images/Resursy_1700.png',
		'Ресурсы город.': 'images/Gorodskie_tovary_1700.png',
		'Начало партии': 'images/Politkarta_1700.png',
		'Ход 1': 'images/Khod_1.png',
		'Ход 2': 'images/Khod_2.png',
		'Ход 3': 'images/Khod_3.png',
		'Ход 4': 'images/Khod_4.png',
		'Ход 5': 'images/Khod_5.png',
		'Ход 6': 'images/Khod_6.png',
		'Ход 7': 'images/Khod_7.png',
		
    }
    if (/^[1-9][0-9]*$/.test(key)) {
        url = `images/karta_${key}_khod.png`
    }
    else if (keys[key] !== undefined) {
        url = keys[key]
    }
    return url
}

function updateURL(event) {
	//console.log(event.target.classList)
    if (event.target.classList.contains('image')) {
        moveID = event.target.innerText
        let newURL = getURL(moveID)
        if (newURL) {
            mapImg.src = newURL
            document.querySelectorAll('.button.active').forEach(item => item.classList.remove('active'))
            //event.target.classList.add('active')
            document.querySelectorAll(`.button.image[data-id="${moveID}"]`).forEach(item => item.classList.add('active'))
            event.stopPropagation()
            event.preventDefault()
        } else {
            mapImg.src = getURL('Полит.карта')
        }
    }

    else if (event.target.classList.contains('menu__header__item')) {
        // remove active class from former active header item
        const activeMenuHeader = document.querySelector('.menu__header__item.active')
        const activeDropdownItem = document.querySelector('.dropdown__item.active')
        const itemId = event.target.dataset.dropdown

        if (activeMenuHeader) {
            activeMenuHeader.classList.remove('active')
            if (activeDropdownItem) {
                activeDropdownItem.classList.remove('active')
                activeDropdownItem.style.visibility = 'hidden'
            }
        }
        // add active class to new active header item based on value
        if (activeMenuHeader !== event.target) {
            event.target.classList.add('active')
            if (itemId) {
                const dropdownMenuItem = document.querySelector(`#${itemId}`)
                dropdownMenuItem.style.visibility = 'visible'
                dropdownMenuItem.classList.add('active')
                event.stopPropagation()
                event.preventDefault()
            }
            else {
                // timeout 0.5 sec remove active status from header item
                setTimeout(() => event.target.classList.remove('active'), 500)
            }
        }
    }
	if (event.target.classList.contains('turns_header')) {
		const activeMenuHeader = document.querySelector('.button.image.turns_header.active')
        const activeDropdownItem = document.querySelector('.dropdown__turns__item.active')
        if (activeMenuHeader) {
			//console.log('deactiv')
            activeMenuHeader.classList.remove('active')
            if (activeDropdownItem) {
                activeDropdownItem.classList.remove('active')
                activeDropdownItem.style.visibility = 'hidden'
            }
        }
        // add active class to new active header item based on value
        if (activeMenuHeader !== event.target) {
			//console.log('activ')
            event.target.classList.add('active')
            const dropdownMenuItem = document.querySelector('.dropdown__turns__item')
            dropdownMenuItem.style.visibility = 'visible'
            dropdownMenuItem.classList.add('active')
            event.stopPropagation()
            event.preventDefault()
        }
	}
}

menu.addEventListener('touchend', event => { updateURL(event) })
menu.addEventListener('click', event => { updateURL(event) })

console.log(`Hello world!`)