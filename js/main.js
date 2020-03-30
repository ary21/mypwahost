$(document).ready(function() {
    let uri = 'https://my-json-server.typicode.com/ary21/mypwa/peoples';

    let listData = ''
    let filterResults = '';
    let filters = [];

    function renderPage(data) {
        filterResults += '<option value="all">Semua Negara</option>'
        $.each(data, function(k, itm) {
            listData += `<div>`+
                `<h5>${itm.name} <small>(${itm.gender})</small></h5>`+
                `<p>${itm.country}</p>`+
            `</div>`
            
            if ($.inArray(itm.country, filters) == -1) {
                filters.push(itm.country)
                filterResults += `<option value="${itm.country}">${itm.country}</option>` 
            }
        })
        
        $('#listData').html(listData)
        $('#filter').html(filterResults)
    }

    let networkReceived = false
    const networkUpdate = fetch(uri).then(response => {
        return response.json()
    }).then(data => {
        networkReceived = true
        renderPage(data)
    })

    caches.match(uri).then(response => {
        if (!response) throw Error('no data cache')
        return response.json()
    }).then(data => {
        if (!networkReceived) {
            renderPage(data)
            console.log('render from cache');
        }
    }).catch(error => {
        if (error) console.log(error);
        return networkUpdate
    })

    $('#filter').on('change', function(){
        const filter = $(this).val()
        let uriFilter = uri

        if (filter != 'all') 
            uriFilter = uri + `?country=${filter}`

            $.get(uriFilter, function(data) {
                listData = '';
                $.each(data, function(k, itm) {
                    listData += `<div>`+
                        `<h5>${itm.name} <small>(${itm.gender})</small></h5>`+
                        `<p>${itm.country}</p>`+
                    `</div>`
                })
                
                $('#listData').html(listData)
            })
    })

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
          navigator.serviceWorker.register('/sw.js').then(function(registration) {
            // Registration was successful
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
          }, function(err) {
            // registration failed :(
            console.log('ServiceWorker registration failed: ', err);
          });
        });
    }
})