
const { io } = require('../index');
const Band = require('../models/band');
const BandsColecction = require('../models/bands_collection');
const bands = new BandsColecction();

bands.addBand(new Band('Queen'));
bands.addBand(new Band('Soda Stereo'));
bands.addBand(new Band('Hereos del Silencio'));
bands.addBand(new Band('Enanitos Verdes'));
bands.addBand(new Band('Los Prisioneros'));
bands.addBand(new Band('Hombres G'));


// NOTAS RELEVANTES

// Las llaves solo son para organizar(no uses las llaves, solo lo que están dentros)


/**
 * Si queremos enviar los mensajes a todos los clientes tan solo añadimos
 * => {' io.emit(event); '}
 * 
 * Si queremos enviar los mensajes a todos los clientes menos a nosotros que 
 * es lo más conveniente, añadimos
 * => {' client.broadcast.emit(event); '}
 * 
 */


// Mensajes por Sockets
io.on('connection', client => {
    console.log('Cliente conectado')

    client.emit('active-bands', bands.getBands());

    client.on('disconnect', () => {
        console.log('Cliente desconectado');
    });

    client.on('mensaje', (payload) => {
        console.log('Mensaje del servidor!', payload);

        io.emit('mensaje', { admin: 'Nuevo mensaje' });
    });


    // Votos de la banda
    client.on('vote-band', (payload) => {
        const newBandVote = bands.voteBand(payload.id);
        console.log(newBandVote);
        bands.voteBand(newBandVote);
        io.emit('active-bands', bands.getBands());
    })

    // Añadir bandas
    client.on('add-band', (payload) => {
        const newBandAdd = new Band(payload.name);
        console.log(newBandAdd);
        bands.addBand(newBandAdd);
        io.emit('active-bands', bands.getBands());
    })

    // Eliminar bandas
    client.on('delete-band', (payload) => {       
        bands.deleteBand(payload.id);
        io.emit('active-bands', bands.getBands());
    })

    // client.on('emitir-mensaje', (payload) => {
    //     console.log(payload);
    // });


});