/*
    1. Render song
    2. Scroll top
    3. Play / Pause / seek
    4. CD rotate
    5. Next/ prev
    6. Random
    7. Next/ Repeat when ended
    8. Active song
    9. Scroll active song into view
    10. Play song when click
*/

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const playlist = $('.play-list')
const cdThumb = $('.cd-thumb')
const heading = $('header h2')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.toggle__btn')
const player = $('.player')
const progress =  $('.progress')
const nextBtn = $('.forward__btn')
const prevBtn = $('.backward__btn')
const repeatBtn = $('.return__btn')
const randomBtn = $('.random__btn')



const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs:  [
        {
            name: 'Golden hour',
            singer: 'Nhan',
            path: './assets/music/y2mate.com - JVKE  Golden hour Lyrics.mp3',
            img: './assets/img/goldenhour.jpg'
        },
        {
            name: 'double take',
            singer: 'Nhan lai toi',
            path: './assets/music/y2mate.com - Lyrics  Vietsub double take  dhruv slowed.mp3',
            img: './assets/img/doubletake.jpg'
        },
        {
            name: 'Industry Baby',
            singer: 'Lil Nas x',
            path: './assets/music/industrybaby.mp3',
            img: './assets/img/industrybaby.jpg'
        },
        {
            name: 'Duong Toi Cho Em ve',
            singer: 'buitruonglinh',
            path: './assets/music/duongtoichoemve.mp3',
            img: './assets/img/DuongToiChoEmVe.jpg'
        },
        {
            name: 'Noi gio roi',
            singer: 'Tinh Lung',
            path: './assets/music/noigioroi.mp3',
            img: './assets/img/noigioroi.jpg'
        },
        {
            name: 'Until I found you',
            singer: 'Mutaka',
            path: './assets/music/until.mp3',
            img: './assets/img/foundyou.jpg'
        },
        {
            name: 'Neon',
            singer: 'Su Rock',
            path: './assets/music/neon.mp3',
            img: './assets/img/raven2.jpg'
        },
        {
            name: 'Raven',
            singer: 'Rock',
            path: './assets/music/raven.mp3',
            img: './assets/img/raven.jpg'
        },
    ],
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index = ${index}>
                    <img src="${song.img}" alt="" class="song__img">
                    <div class="song__body">
                        <h3 class="song__title">${song.name}</h3>
                        <p class="song__sub-title">${song.singer}</p>
                    </div>
                    <div class="song__option">
                        <i class="fa-solid fa-ellipsis"></i>
                    </div>
                </div>
            `
        })
        playlist.innerHTML = htmls.join('')
    },
    handleEvent: function() {
        const _this = this

        // Xử lý sự kiện CD quay
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ],{
            duration: 10000,
            interations: Infinity
        })
        cdThumbAnimate.pause()
        

        //Xử lý sự kiện scroll (phóng to/ thu nhỏ CD thumb)
        const cdWidth = cd.offsetWidth
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth/cdWidth
        }
        // Xử lý sự kiện click vào playBtn 
        playBtn.onclick = function() {
            if(_this.isPlaying) {
                audio.pause()
            }else {
                audio.play()
                
            }
        }
        //Khi song được pause
        audio.onpause = function() {
            player.classList.remove('playing')
            _this.isPlaying = false
            cdThumbAnimate.pause()
        }

        //Khi song được play
        audio.onplay = function() {
            _this.isPlaying = true
            player.classList.add('playing') 
            cdThumbAnimate.play()
        }

        // Xử lí thanh input khi tiến độ bài hát đang chạy
        audio.ontimeupdate = function() {
            if(this.duration) {
                const progressPercent = Math.floor(this.currentTime / this.duration * 100)
                progress.value = progressPercent
            }
        }

        // Xử lí khi tua bài hát
        progress.onchange = function() {
            audio.currentTime = Math.floor(audio.duration * this.value / 100)
        }

        // Xử lý nextBtn, prevBtn
        nextBtn.onclick = function() {
            if(_this.isRandom) {
                _this.randomSong()
            }else {
                _this.nextSong()
                
            }
            // Scroll into active song
            _this.scrollView()
            _this.render()
            audio.play()
        }
        prevBtn.onclick = function() {
            if(_this.isRandom) {
                _this.randomSong()
            }else {
                _this.prevSong()
            }
            // Scroll into active song
            _this.scrollView()
            _this.render()
            audio.play()
        }

        // Xử lý random song
        randomBtn.onclick = function() {
           _this.isRandom = !_this.isRandom
           randomBtn.classList.toggle('active', _this.isRandom)
           
        }

        // Xử lý khi bài hát ended
        audio.onended = function() {
            if(_this.isRepeat) {
                audio.play()
            }else {
                nextBtn.click()
            }
        }


        // Xử lý sự kiện repeat song
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active', _this.isRepeat)

        }

        //Hành vi scroll into view
        

        // Lắng nghe hành vi click vào playlist
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            if(songNode || e.target.closest('.song__option')) {
                //Xử lý khi mà click vào song
                if(songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
                // Xử lý khi mà click vào option
                if(e.target.closest('.song__option')) {
                    console.log('Chức năng này đang chưa được thực hiện')
                }
            }
            
        }
    },
    scrollView: function() {
       setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            })
       }, 300);
    },
    repeatSong: function() {
        if(this.isRepeat) {

        }
    },
    randomSong: function() {
        let randomIndex;
        do{
            randomIndex = Math.floor(Math.random() * this.songs.length )
        }while(randomIndex === this.currentIndex)
        this.currentIndex = randomIndex
        this.loadCurrentSong()
    },
    nextSong: function() {
        this.currentIndex++
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function() {
        this.currentIndex--
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    loadCurrentSong: function() {
        heading.innerText = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.img}')`
        audio.src = this.currentSong.path
    },
    start: function() {
        // Định nghĩa các thuộc tính
        this.defineProperties()

        //Render playlist
        this.render()


        //Lắng nghe và xử lí các sự kiện
        this.handleEvent()

        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong()
        
    },
}


app.start()