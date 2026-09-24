(function () {
    'use strict';

    // Öz serverinizin ünvanını bura yazın (məsələn: http://sizin-ip-veya-domen.com:5000)
    const SERVER_URL = 'http://127.0.0.1:5000';

    function FilmCehennemiPlugin() {
        let network = new Lampa.Reguest();

        this.title = 'Film İzle HD';

        this.search = function (params, success, error) {
            network.silent(`${SERVER_URL}/api/search?q=` + encodeURIComponent(params.query), function (data) {
                let results = [];

                if (Array.isArray(data)) {
                    data.forEach(item => {
                        results.append({
                            title: item.title,
                            vote_average: parseFloat(item.rating) || 0,
                            release_date: item.year,
                            img: item.img,
                            url: item.url,
                            card_type: 'movie'
                        });
                    });
                }

                success(results);
            }, function () {
                error();
            });
        };

        this.element = function (element, data) {
            // Filmin üzərinə kliklədikdə detalları çəkib pleyeri açırıq
            element.on('hover:enter', () => {
                network.silent(`${SERVER_URL}/api/details?url=` + encodeURIComponent(data.url), function (details) {
                    if (details && details.streams && details.streams.length > 0) {
                        let stream = details.streams[0]; // İlk işlək axın
                        
                        let player_element = {
                            title: details.title,
                            url: stream.m3u8_url,
                            headers: stream.headers || {}
                        };

                        Lampa.Player.play(player_element);
                        Lampa.Player.playlist([player_element]);
                    } else {
                        Lampa.Noty.show('Bu film üçün izləmə linki tapılmadı.');
                    }
                }, function () {
                    Lampa.Noty.show('Server xətası baş verdi.');
                });
            });
        };
    }

    // Lampa mənbələrinə yeni plugin kimi əlavə edirik
    if (window.Lampa) {
        Lampa.Api.sources.filmcehennemi = FilmCehennemiPlugin;
        
        // Parametrlər menyusunda mənbə kimi görünməsi üçün
        console.log('Film İzle HD Plugin yükləndi');
    }
})();
