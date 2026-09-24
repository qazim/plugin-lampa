(function () {
    'use strict';

    const SERVER_URL = 'http://192.168.100.3:5000';

    function FilmCehennemiSource(object) {
        let network = new Lampa.Reguest();

        this.search = function (params, success, error) {
            network.silent(`${SERVER_URL}/api/search?q=` + encodeURIComponent(params.query), function (data) {
                let results = [];
                if (Array.isArray(data)) {
                    data.forEach(item => {
                        results.push({
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
            element.on('hover:enter', () => {
                network.silent(`${SERVER_URL}/api/details?url=` + encodeURIComponent(data.url), function (details) {
                    if (details && details.streams && details.streams.length > 0) {
                        let stream = details.streams[0];
                        let player_element = {
                            title: details.title,
                            url: stream.m3u8_url,
                            headers: stream.headers || {}
                        };
                        Lampa.Player.play(player_element);
                        Lampa.Player.playlist([player_element]);
                    } else {
                        Lampa.Noty.show('İzləmə linki tapılmadı.');
                    }
                }, function () {
                    Lampa.Noty.show('Serverə qoşulmaq olmadı.');
                });
            });
        };
    }

    if (window.Lampa) {
        // API mənbəsi kimi qeydiyyat
        Lampa.Api.sources.filmcehennemi = FilmCehennemiSource;

        // Axtarış menyusunda seçilə bilən mənbə kimi əlavə edirik
        if (Lampa.Search && Lampa.Search.sources) {
            Lampa.Search.sources.filmcehennemi = {
                title: 'Film İzle HD',
                search: function (params, success, error) {
                    let src = new FilmCehennemiSource();
                    src.search(params, success, error);
                }
            };
        }
    }
})();
