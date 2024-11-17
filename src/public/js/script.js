const canvas = document.getElementById("canvas"); // dohvati canvas element
const ctx = canvas.getContext("2d"); // dohvati kontekst iz canvasa po kojem se može crtati

canvas.width = window.innerWidth; // postavi širinu canvasa
canvas.height = window.innerHeight; // postavi visinu canvasa

const boje = ["red", "yellow", "green", "turquoise", "indigo", "violet", "pink"] // boje za cigle

const brCiglaRed = 10; // broj cigli u pojedinom redu
const brCiglaStupac = 7; // broj cigli u pojedinom stupcu
const palicaH = 10; // visina palice
const palicaW = 150; // širina palice
let palicaX = (canvas.width - palicaW) / 2; // početak crtanja palice na X osi
let palicaY = canvas.height - palicaH; // početak crtanja palice na Y osi (odozgora prema dolje)
let lopticaX = canvas.width / 2; // početak crtanja loptice na X ois
let lopticaY = canvas.height - 25; // početak crtanja loptice na Y osi
const palicaBrzina = 10; // brzina pomicanja palice
let lopticaBrzina = 5; // brzina pomicanja loptice
let lopticaPomakX = lopticaBrzina * (Math.random() > 0.5 ? 1 : -1); // odabir smjera u kojem će loptica kretati na X osi (lijevo ili desno od sredine palice)
let lopticaPomakY = -lopticaBrzina; // odabir smjera u kojem će loptica kretati na Y osi (prema gore)
const ciglaW = canvas.width / brCiglaRed - 25; // širina cigle (računa se dinamički kao širina prozora podijeljena na broj cigli u svakom redu, minus 20 zbog razmaka između cigli)
const ciglaH = 20; // visina cigle
const ciglaRazmak = 20; // razmak između pojedine cigle
let desnaStrelica = false; // je li desna strelica kliknuta
let lijevaStrelica = false; // je li lijeva strelica kliknuta
let brBodova = 0; // trenutni broj pogođenih cigli
let najboljiRezultat = localStorage.getItem("najboljiRezultat") || 0; // najbolji broj pogođenih cigli prije završetka igre

const cigle = [] // mapa za cigle
for (let i = 0; i < brCiglaRed; i++) { // petlja za stupce
    cigle[i] = [] // svaki stupac ima listu cigli
    for (let j = 0; j < brCiglaStupac; j++) { // petlja za redove
        cigle[i][j] = { x: 0, y: 0, pogodena: 0 } // za svaku ciglu u određenom stupcu i redu se postavlja X koordinata i Y koordinata za crtanje te je li cigla pogođena ili nije (inicijalno nije)
    }
}

function crtajPalicu() { // funkcija za crtanje palice
    ctx.fillStyle = "red"; // boja palice (crvena)
    ctx.shadowColor = "red"; // boja sjene palice (crvena)
    ctx.shadowBlur = 50; // jačina sjene
    ctx.fillRect(palicaX, palicaY, palicaW, palicaH); // nacrtaj palicu na određenoj X i Y koordinati s određenom širinom i visinom
}

function crtajLopticu() { // funkcija za crtanje loptice
    ctx.beginPath(); // započni crtanje
    ctx.arc(lopticaX, lopticaY, 8, 0, Math.PI * 2); // kreni crtati luk od određene X i Y koordinate s radijusom 4 dok se ne ispuni cijeli krug (2PI)
    ctx.fillStyle = "#fff"; // boja loptice (bijela)
    ctx.fill(); // ispuni unutar luka
    ctx.closePath(); // zaustavi crtanje
}

function crtajCigle() { // funkcija za crtanje cigli
    cigle.forEach((stupacCigli, i) => { // petlja za prolazak svakog stupca cigli
        stupacCigli.forEach((cigla, j) => { // petlja za prolazak svake cigle u pojedinom stupcu
            if (cigla.pogodena === 0) { // ako cigla nije pogođena
                cigla.x = i * (ciglaW + ciglaRazmak) + 35; // postavi X koordiantu cigle na indeks stupca pomnožen sa širinom cigle + razmakom cigle + 35 jer indeks kreće od 0
                cigla.y = j * (ciglaH + ciglaRazmak) + 35; // postavi Y koordinatu cigle na indeks reda pomnožen s vision cigle + razmakom cigle + 35 jer indkes kreće od 0
                ctx.fillStyle = boje.at(j % 7); // postavi boju cigle na boju od pojedinog reda
                ctx.shadowColor = boje.at(j % 7); // postavi boju sjene cigle na boju od pojedinog reda
                ctx.shadowBlur = 10; // postavi jačinu sjene
                ctx.fillRect(cigla.x, cigla.y, ciglaW, ciglaH); // iscrtaj pravokuntik na određenim koordinatama X i Y s određenom širinom i visinom cigle
            }
        });
    });
}

function nacrtajRezultat() {
    ctx.font = "16px Arial"; // veličina slova i stil slova
    ctx.fillStyle = "#fff"; // boja slova (bijela)
    ctx.shadowColor = "red"; // boja sjene (crvena)
    ctx.shadowBlur = 10; // jačina sjene
    ctx.fillText(`Bodovi: ${brBodova}`, canvas.width - 100, 20); // iscrtaj tekst na određenim koordinatama X (širina ekrana - 100) i Y (20)
    ctx.fillText(`Najbolji rezultat: ${najboljiRezultat}`, canvas.width - 250, 20); // iscrtaj tekst na određenim koordinatama X (širina ekrana - 250) i Y (20)
}

function sudar() {
    let flag = 0; // zastavica jesu li uništene sve cigle
    cigle.forEach((stupacCigli, i) => { // petlja za prolazak svakog stupca cigli
        stupacCigli.forEach((cigla, j) => { // petlja za prolazak svake cigle u pojedinom stupcu
            if (cigla.pogodena === 0) { // ako cigla nije pogođena
                if (
                    lopticaX >= cigla.x - 1 &&
                    lopticaX <= cigla.x + ciglaW + 1 &&
                    lopticaY >= cigla.y - 1 &&
                    lopticaY <= cigla.y + ciglaH + 1
                ) { // ako se loptica nalazi unutar širine cigle i dotakla je ciglu
                    lopticaPomakY = -lopticaPomakY; // promjeni Y smjer kretanja loptice
                    cigla.pogodena = 1; // postavi da je cigla pogođena kako se nebi nacrtala
                    brBodova++; // povećaj broj pogođenih cigli
                    if (brBodova > najboljiRezultat) { // ako je broj pogođenih cigli prešao prijašnji najbolji rezultat
                        najboljiRezultat = brBodova; // postavi novi najbolji rezultat
                        localStorage.setItem("najboljiRezultat", najboljiRezultat); // u localStorage zapamti novi najbolji rezultat pod ključem najboljiRezultat
                    }
                    if (brBodova === brCiglaRed * brCiglaStupac) { // ako je broj pogođenih cigli jednak ukupnom broju cigli (broj cigli u redu puta broj cigli u stupcu)
                        flag = 1; // postavi zastavicu da su sve cigle uništene 

                        return; // prekini petlju
                    }
                }
            }
        });
    });

    return flag; // obavijesti da su sve cigle uništene
}

document.addEventListener("keydown", (e) => { // slušatelj na pritisak tipke tipkovnice
    if (e.key === "ArrowLeft") { // ako je pritisnuta lijeva strelica 
        lijevaStrelica = true; // postavi da je lijeva strelica pritisnuta
    } 
    else if (e.key === "ArrowRight") { // ako je pritisnuta desna strelica
        desnaStrelica = true; // postavi da je desna strelica pritisnuta
    }
});

document.addEventListener("keyup", (e) => { // slušatelj na puštanje tipke tipkovnice
    if (e.key === "ArrowLeft") { // ako je puštena lijeva strelica
        lijevaStrelica = false; // postavi da lijeva strelica nije pritisnuta
    } 
    else if (e.key === "ArrowRight") { // ako je puštena desna strelica
        desnaStrelica = false; // postavi da desna strelica nije pritisnuta
    }
});

function crtaj() {
    ctx.clearRect(0, 0, canvas.width, canvas.height) // obriši konteks canvasa po cijeloj širini i visini
    crtajPalicu(); // kreni crtati palicu
    crtajLopticu(); // kreni crtati lopticu
    let flag = sudar(); // detektiraj sudar i jesu li sve cigle uništene
    crtajCigle(); // kreni crtati cigle
    nacrtajRezultat(); // kreni crtati rezultat

    if (flag) { // ako su sve cigle uništene
        ctx.font = "40px Arial"; // veličina slova i stil slova
        ctx.fillStyle = "red"; // boja slova (crvena)
        ctx.fillText("Čestitam, uspjeli ste srušiti sve cigle!", canvas.width / 2 - 300, canvas.height / 2); // iscrtaj text na sredini ekrana da su sve cigle uništene

        return; // prekini crtanje, igra je gotova
    }

    lopticaX += lopticaPomakX; // pomakni lopticu u X smjeru
    lopticaY += lopticaPomakY; // pomakni lopticu u Y smjeru

    if (lopticaX + lopticaPomakX > canvas.width - 5 || lopticaX + lopticaPomakX < 5) { // ako je loptica udarila desu stranu ekrana ili je loptica udarila lijevu stranu ekrana
        lopticaPomakX = -lopticaPomakX; // promijeni X smijer kretanja u suprotan smijer
    }
    if (lopticaY + lopticaPomakY < 5) { // ako je loptica udarila gornji dio ekrana
        lopticaPomakY = -lopticaPomakY; // promijeni Y smijer kretanja u suprotan smijer
    } else if (lopticaY >= canvas.height - palicaH - 4) { // ako je loptica iznad visine palice i u razini palice
        if (lopticaX >= palicaX - 5 && lopticaX <= palicaX + palicaW + 5) { // ako je loptica unutar širine palice
            const mjestoDoticaja = (lopticaX - palicaX) / palicaW; // mjesto di su se palica i loptica dotaknuli
            const maxKut = 11 * Math.PI / 12; // maksimalni kut odbijanja (165 stupnjeva)
            const kut = (mjestoDoticaja - 0.5) * maxKut; // kut pod kojim će se loptica kretati nakon odbijanja
            const brzina = Math.sqrt(lopticaPomakX * lopticaPomakX + lopticaPomakY * lopticaPomakY); // računanje brzine da bude ista prijašnjoj na temelju prijašnjih pomaka
            lopticaPomakX = brzina * Math.sin(kut); // postavljanje novog pomaka na X osi
            lopticaPomakY = -brzina * Math.cos(kut); // postavljanje novog pomaka na Y osi
        } else { // ako loptica nije unutar širine palice 
            if (lopticaY >= canvas.height) { // ako je loptica prešla visinu ekrana
                ctx.font = "24px Arial"; // veličina slova i stil slova
                ctx.fillStyle = "red"; // boja slova (crvena)
                ctx.fillText("GAME OVER", canvas.width / 2 - 70, canvas.height / 2); // iscrtaj tekst na sredini ekrana da je igra završila
    
                return; // prestani crtanje, igra je gotova
            }
        }
    }

    if (lijevaStrelica && palicaX > 0) { // ako je pritisnuta lijeva strelica i palica nije došla do lijevog ruba ekrana
        palicaX -= palicaBrzina; // pomakni palicu u lijevo za brzinu micanja palice
    } 
    else if (desnaStrelica && palicaX < canvas.width - palicaW) { // ako je pritisnuta desna strelica i palica nije došla do desnog ruba ekrana
        palicaX += palicaBrzina; // pomakni palicu u desno za brzinu micanja palice
    }
    
    requestAnimationFrame(() => { // svaki puta kada pozovemo crtanje želimo osvježiti prozor
        crtaj(); // na osvježavanje prozora ponovo pozovemo crtanje
    });
}

window.onload = crtaj; // na učitavanje stranice crtamo