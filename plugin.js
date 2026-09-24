(function () {
    'use strict';

    const SERVER_URL = 'http://127.0.0.1:5000';

    function FilmCehennemiOnline(component) {
        let network = new Lampa.Reguest();

        this.search = function (object, success, error) {
            let query = object.movie.title || object.movie.name;
            
            network.silent(`${SERVER_URL}/api/search?q=` + encodeURIComponent(query), function (data) {
                let results = [];
                if (Array.isArray(data)) {
                    data.forEach(item => {
                        results.push({
                            title: item.title,
                            year: item.year,
                            img: item.img,
                            url: item.url,
                            info: 'Film İzle HD'
                        });
                    });
                }
                success(results);
            }, function () {
                error();
            });
        };

        this.card = function (object, success, error) {
            network.silent(`${SERVER_URL}/api/details?url=` + encodeURIComponent(object.url), function (details) {
                let folder = [];
                if (details && details.streams && details.streams.length > 0) {
                    details.streams.forEach((stream, index) => {
                        folder.push({
                            title: `HD - Alternativ ${index + 1}`,
                            url: stream.m3u8_url,
                            headers: stream.headers || {},
                            quality: 'HD'
                        });
                    });
                }
                success(folder);
            }, function () {
                error();
            });
        };
    }

    if (window.Lampa) {
        // Onlayn mənbələrə əlavə edirik ki, "смотреть" menyusunda çıxsın
        if (Lampa.Manifest && Lampa.Manifest.plugins) {
            // Lampa-nın onlayn sisteminə qeydiyyat
            Lampa.Component.add('filmcehennemi_online', FilmCehennemiOnline);
            
            // Onlayn mənbə siyahısına daxil edirik
            if (window.lampa_settings && lampa_settings.plugins_prepend) {
                // Avtomatik inteqrasiya
            }
        }
        
        // Alternativ olaraq birbaşa online mod kimi tanütmaq
        console.log('Film İzle HD Online Parser yükləndi');
    }
})();
