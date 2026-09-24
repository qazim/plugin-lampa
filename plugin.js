(function () {
    'use strict';

    const SERVER_URL = 'http://127.0.0.1:5000';

    function FilmCehennemiPlugin() {
        let network = new Lampa.Reguest();

        this.title = 'Film İzle HD';

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
            }, function () { error(); });
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
        Lampa.Api.sources.filmcehennemi = FilmCehennemiPlugin;
    }
})();
