// ==UserScript==
// @name       Manga Reading helper
// @namespace  ranhchim.ml
// @version    0.2
// @description  simple helper
// @noframes
// @include      /^https?:\/\/mangakakalot\.com\/chapter\/[a-zA-Z_\-0-9]+\/chapter_[0-9\.]+$/
// @match *://bato.to/reader*
// @match *://mangafox.me/manga/*/*/*
// @match *://mangafox.la/manga/*/*/*
// @match *://fanfox.net/manga/*/*/*
// @match *://readms.net/r/*/*
// @match *://readms.net/read/*/*
// @match *://mangastream.com/r/*/*/*/*
// @match *://mangastream.com/read/*/*/*/*
// @match *://www.mangareader.net/*/*
// @match *://*.mangahere.co/manga/*/*
// @match *://*.mangahere.cc/manga/*/*
// @match *://www.mangapanda.com/*/*
// @match *://mangapark.me/manga/*/*/*
// @match *://mngcow.co/*/*
// @match *://centraldemangas.org/online/*/*
// @match *://*.com.br/leitura/online/capitulo/*
// @match *://www.mangatown.com/manga/*/*
// @match *://manga-joy.com/*/*
// @match *://*.dm5.com/m*
// @match *://*.senmanga.com/*/*
// @match *://www.japscan.com/lecture-en-ligne/*
// @match *://www.pecintakomik.com/manga/*/*
// @match *://mangawall.com/manga/*/*
// @match *://manga.animea.net/*
// @match *://kissmanga.com/Manga/*/*
// @match *://view.thespectrum.net/series/*
// @match *://manhua.dmzj.com/*/*
// @match *://hqbr.com.br/hqs/*/capitulo/*/leitor/0
// @match *://www.dmzj.com/view/*/*
// @match *://mangaindo.id/*/*
// @match *://mangadoom.co/*/*
// @match *://*.mangago.me/read-manga/*/*
// @match *://mangalator.ch/show.php?gallery=*
// @match *://eatmanga.com/Manga-Scan/*/*
// @match *://www.mangacat.me/*/*/*
// @match *://www.mangahen.com/*/*
// @match *://www.readmng.com/*/*
// @match *://mangatraders.biz/read-online/*
// @match *://www.mangainn.net/manga/chapter/*
// @match *://*.kukudm.com/comiclist/*/*
// @match *://www.mangamap.com/*/*
// @match *://www.mangachapter.me/*/*/*.html
// @match *://kawaii.ca/reader/*
// @match *://lonemanga.com/manga/*/*
// @match *://read.egscans.com/om/manga/*/*
// @match *://manga.madokami.al/reader/*
// @match *://read.egscans.com/*
// @match *://imperialscans.com/read/*
// @match *://www.chuixue.com/manhua/*/*
// @match *://www.sh-arab.com/manga/*
// @match *://spinybackmanga.com/*
// @match *://br.mangahost.com/manga/*/*
// @match *://www.manga.ae/*/*/*
// @match *://mangaforall.com/manga/*/*/*
// @match *://hellocomic.com/*/*/*
// @match *://www.3asq.info/*/*
// @match *://*.readcomiconline.to/Comic/*
// @match *://*.moonbunnycafe.com/*
// @match *://*.mangaeden.com/*
// @match *://*.comicastle.org/read-*
// @match *://*.mymh8.com/chapter/*
// @match *://*.unionmangas.net/leitor/*
// @match *://*.otakusmash.com/*/*
// @match *://*.mangahome.com/manga/*/*
// @match *://*.readcomics.tv/*/chapter*
// @match *://*.cartoonmad.com/comic/*
// @match *://*.comicnad.com/comic/*
// @match *://*.ikanman.com/comic/*/*
// @match *://*.manhuagui.com/comic/*/*
// @match *://*.mangasail.com/*
// @match *://*.mangatail.com/*
// @match *://*.titaniascans.com/reader/*/*
// @match *://*.komikstation.com/*/*/*
// @match *://*.gmanga.me/mangas/*/*/*
// @match *://mangadex.org/chapter/*
// @match *://merakiscans.com/*/*
// @match *://biamamscans.com/read/*
// @match *://read.lhtranslation.com/*.html
// @match *://www.930mh.com/manhua/*/*.html*
// @match *://www.mangabox.me/reader/*/episodes/*/
// @match *://twocomic.com/view/comic_*.html?ch=*
// -- FOOLSLIDE START
// @match *://manga.redhawkscans.com/reader/read/*
// @match *://reader.s2smanga.com/read/*
// @match *://casanovascans.com/read/*
// @match *://reader.vortex-scans.com/read/*
// @match *://reader.roseliascans.com/read/*
// @match *://mangatopia.net/slide/read/*
// @match *://www.twistedhelscans.com/read/*
// @match *://sensescans.com/reader/read/*
// @match *://reader.kireicake.com/read/*
// @match *://substitutescans.com/reader/read/*
// @match *://mangaichiscans.mokkori.fr/fs/read/*
// @match *://reader.shoujosense.com/read/*
// @match *://www.friendshipscans.com/slide/read/*
// @match *://manga.famatg.com/read/*
// @match *://www.demonicscans.com/FoOlSlide/read/*
// @match *://reader.psscans.info/read/*
// @match *://otscans.com/foolslide/read/*
// @match *://necron99scans.com/reader/read/*
// @match *://manga.inpowerz.com/read/*
// @match *://reader.evilflowers.com/read/*
// @match *://reader.cafeconirst.com/read/*
// @match *://kobato.hologfx.com/reader/read/*
// @match *://abandonedkittenscans.mokkori.fr/reader/read/*
// @match *://jaiminisbox.com/reader/read/*
// @match *://*.gomanga.co/reader/read/*
// @match *://reader.manga-download.org/read/*/*
// @match *://*.manga-ar.net/manga/*/*/*
// @match *://*.helveticascans.com/r/read/*
// @match *://reader.thecatscans.com/read/*
// @match *://yonkouprod.com/reader/read/*
// @match *://reader.championscans.com/read/*
// @match *://reader.whiteoutscans.com/read/*
// @match *://hatigarmscans.eu/hs/read/*
// @match *://lector.kirishimafansub.com/lector/read/*
// @match *://hotchocolatescans.com/fs/read/*
// @match *://*.slide.world-three.org/read/*
// -- FOOLSLIDE END
// ==/UserScript==


// Execute a function when the user releases a key on the keyboard
window.addEventListener('keyup', function(evt) {
  if (event.keyCode === 70) {

      var link = document.getElementsByClassName("ml-chap-next")[0];
      if (link === undefined) {
          link = document.getElementById("trackr-next");
          console.log("using tracker.moe bar");
      }

      console.log(link);
      window.open(link.href, '_blank');
      //link.dispatchEvent(new MouseEvent("click", {ctrlKey: true}));
  }

    if (event.keyCode === 222) {
        document.getElementById('trackCurrentChapter').click();
  }
});
