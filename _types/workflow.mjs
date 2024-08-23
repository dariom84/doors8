/*
Esta biblioteca puede usarse desde el cliente y el servidor
Es una traduccion de la codelib vbscript
*/

// Para freshear: https://cdn.cloudycrm.net/ghcv/global/workflow.mjs?_fresh=1

/** @type Context */
var ctx;
/** @type {import('./_types/doorsapi2.mjs').Session} */
var dSession;
/** @type {import('./_types/doorsapi2.mjs').Document} */
var doc;
/** @type {import('./_types/doorsapi2.mjs').Folder} */
var folder;
/** @type {import('./_types/doorsapi2.mjs').Utilities} */
var utils;

var nodemailer;
export var escapeRegExp
export var wkfErrors;

var thisMod = {
    repo: 'Global',
    path: 'workflow.mjs',
	ref: 'main',
}

var consTags = {
	consoleTag1: 'Global://workflow.mjs'
}

export function setContext(context) {
    ctx = context;
	dSession = context.dSession;
    utils = dSession.utils;
	doc = context.doc;
	folder = context.folder;
	wkfErrors = [];
}

// Los modulos se importan dinamicamente cdo hacen falta
export async function importEscapeRegExp() {
	if (!escapeRegExp) {
		if (dSession.node.inNode) {
			escapeRegExp = (await import('escape-string-regexp')).default;
		} else {
			escapeRegExp = (await import('https://cdn.jsdelivr.net/npm/escape-string-regexp@5.0.0/+esm')).default;
		}
	}
}

async function importNodeMailer() {
	if (!nodemailer) {
		if (dSession.node.inNode) {
			nodemailer = (await import('nodemailer')).default;
		} else {
			throw new Error('nodemailer cannot be used in client-side');
		}
	}
}

/**
Esta funcion manda una invitacion de calendar. Por ahora solo se puede usar desde la web.

TODO: No estoy pudiendo mandar bien los calendar con nodemailer, por eso este workaround
con calendarXHR, que lo hace con Cdo.Message :(
Para retomar: https://nodemailer.com/message/calendar-events/

@example
modWkf.calendar({
	subject: 'Llamar a Jorge',
	fromDate: new Date(),
});

modWkf.calendar({
	from, // Direccion de respuesta. Def el usuario actual.
	participants, // Emails de los invitados, pueden ser varios separados por coma. Def el usuario actual.
	subject, // Asunto
	description, // Texto que se incluye en el cuerpo de la cita. Opcional.
	fromDate, // Fecha de inicio. Def now.
	toDate, // Fecha de fin. Def 30' del inicio.
});
*/
export async function calendar(options) {
	if (!options.participants) options.participants = (await dSession.currentUser).email;
	if (options.fromDate) options.fromDate = moment(options.fromDate).format('YYYY-MM-DD kk:mm');
	if (options.toDate) options.fromDate = moment(options.toDate).format('YYYY-MM-DD kk:mm');

	var url = '/c/codelibapi.asp?codelib=calendarXHR';

	var data = [];
	for (var prop in options) {
		data.push(encodeURIComponent(prop) + '=' + encodeURIComponent(options[prop]));
	}
	data = data.join('&');

	var res = await fetch(url, {
		method: 'POST',
		cache: 'no-cache',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded, charset=UTF-8',
		},
		body: data,
	});

	if (res.ok) {
		return true;

	} else {
		throw new Error('Status ' + res.status + ' - ' + await res.text());
	}
}

/**
Busca user-agent en el contexto y devuelve true si es un dispositivo mobil.
*/
export function isMobile() {
	let ua = propRecurs(ctx.message, 'user-agent', { ci: true });
	return ua ? (ua.match(/Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|(hpw|web)OS|Opera M(obi|ini)/i) || []).length > 0 : ua;
}

/**
Busca la propiedad key dentro del objeto obj de manera recursiva y retorna el valor.
options = {
	ci: case insensitive (def false)
}
*/
export function propRecurs(obj, key, options) {
	if (Array.isArray(obj)) {
		for (let i = 0; i < obj.length; i++) {
			let el = obj[i];
			let ret = propRecurs(el, key, options);
			if (ret != undefined) return ret;
		};

	} else if (typeof obj == 'object' && obj != null) {
		for (const [k, v] of Object.entries(obj)) {
			let comp = options.ci ? k.toLowerCase() == key.toLowerCase() : k == key;
			if (comp) {
				return v;
			} else {
				let ret = propRecurs(v, key, options);
				if (ret != undefined) return ret;
			}
		}
	}

	return undefined;
}

/**
options se usa solo en node. Ver https://github.com/mdevils/html-entities
*/
export function htmlEncode(text, options) {
	var cTags = Object.assign({ consoleTag2: 'htmlEncode' }, consTags);
	console.log('Metodo deprecado, usar dSession.utils.htmlEncode', cTags);
	return dSession.utils.htmlEncode(text, options);
}

/**
Agrega un favorito para el usuario logueado.
fav puede ser id o path.

@returns {Promise}
*/
export async function addFav(fav) {
	var newFav = utils.cNum(fav);
	if (newFav == null) newFav = (await dSession.folder(fav)).id
	var favs = await dSession.userSettings('FLD_FAVORITES');
	var favsArr = favs ? favs.split(',').map(el => utils.cNum(el)) : [];
	if (favsArr.indexOf(newFav) < 0) {
		favsArr.push(newFav);
		await dSession.userSettings('FLD_FAVORITES', favsArr.join(','));
	}
}

/**
Suma amount units a date.
units: https://momentjs.com/docs/#/manipulating/add/

@returns {Date}
*/
export function dateAdd(date, amount, unit) {
	return utils.moment(utils.cDate(date)).add(amount, unit).toDate();
}

export function requeridos(fields) {
    var arr = fields.split(',');
    arr.forEach(el => {
        var f = doc.fields(el.trim());
        if (f.valueEmpty) {
            addError(`'${f.label}' es un campo requerido`);
        }
    });
}

// todo: guardar los errores en un tag del doc
export function addError(err) {
	wkfErrors.push(err);
}

// todo: agregar opcion html
export function raiseWorkflowErrors() {
	if (wkfErrors.length > 0) {
		throw new Error(wkfErrors.join('\n')); //todo: ver como hacemos con el html
	}
}

/**
Alias de raiseWorkflowErrors
*/
export function raiseWkfErrors() {
    return raiseWorkflowErrors();
}

/**
Acumula codigo para el agente en el tag AGENTE
*/
export function agente(code) {
	let aux = doc.tags.AGENTE;
	aux = (aux ? aux + '\n' : '');
	doc.tags.AGENTE = aux + code;
}

/**
Baja el TAG a la PROPERTY (poner al final del beforeSave o en afterSave)

@returns {Promise}
*/
export async function agenteCommit() {
	if (doc.tags.AGENTE) {
		let aux = await doc.properties('AGENTE');
		aux = (aux ? aux + '\n' : '');
		await doc.properties('AGENTE', aux + doc.tags.AGENTE);
	}
}

/**
Devuelve el valor convertido en number, o elseVal si no es un numero
*/
export function cNumElse(value, elseVal) {
	var num = utils.cNum(value);
	return num != null ? num : elseVal;
}

/**
Devuelve el valor convertido en date, o elseVal si no es una fecha
*/
export function cDateElse(value, elseVal) {
	var dt = utils.cDate(value);
	return dt != null ? dt : elseVal;
}

/**
Manda un mail rapido

@example
options = {
	to // destinatarios
	subject // asunto
	text // cuerpo en texto plano
	html // cuerpo html
};

@returns {Promise<Object>}
*/
export async function quickMail(options) {
	var msg = await newMsg();
	msg.to = options.to;
	msg.subject = options.subject;
	if (options.text != undefined) msg.text = options.text;
	if (options.html != undefined) msg.html = options.html;
	addMsgFooters(msg);
	return await sendMail(msg);
}

export function addMsgFooters(msg) {
	if (msg.html) {
		msg.html += `<br><hr>
<span style="font-family:tahoma,sans-serif;font-size:x-small;color:rgb(0,32,96);">
Powered by <b>Cloudy CRM</b> <font color="#990000">|</font> 
<a href="https://cloudy.ar" target="_blank">cloudy.ar</a>
</span>`
	}

	if (msg.text) {
		msg.text += `
-----
Powered by Cloudy CRM | https://cloudy.ar`
	}
}

/**
Retorna una plantilla de email

@example
options = {
	name // template name
	nameField // campo del nombre (def nombre)
	folder // templates folder (path o id, def /config/plantillas)
	subjectField // field del subject (def titulo)
	textField // field del textBody (def undefined)
	htmlField // field del htmlBody (def texto)
	codeField // field del codigo (def codigojs)
};
var msg = await cf.msgFromTemp({ name: 'Bienvenido' });
var msg = await cf.msgFromTemp({
	name: 'Bienvenido',
	textField: 'texto',
	htmlField: undefined
}); // Manda texto plano

// En codeField (tengo soporte para await):
tokens.add('[nombre]', doc.fields('nombre').value);

@returns {Promise<Object>}
*/
export function messageFromTemplate(options) {
	return new Promise(async (resolve, reject) => {
		var opt = {
			nameField: 'nombre',
			folder: '/config/plantillas',
			subjectField: 'titulo',
			htmlField: 'texto',
			codeField: 'codigojs',
		}
		Object.assign(opt, options);

		var fldId;
		try { fldId = folder.id } catch(er) {};

		var tmpFld = await dSession.folder(opt.folder, fldId);
		var tmpDoc = await tmpFld.doc(opt.nameField + ' = ' + dSession.db.sqlEnc(opt.name, 1));
		var msg = await newMessage();

		var fields = tmpDoc.fields();
	
		var f = opt.subjectField;
		if (f && fields.has(f)) msg.subject = fields.get(f).value;
	
		f = opt.textField;
		if (f && fields.has(f)) msg.text = fields.get(f).value;
	
		f = opt.htmlField;
		if (f && fields.has(f)) msg.html = fields.get(f).value;
	
		// Tokens
		f = opt.codeField;
		if (f && fields.has(f) && fields.get(f).value) {
			var tokens = utils.newDoorsMap();
			await evalCode(fields.get(f).value);
			await replaceMsgTokens(msg, tokens)
		}

		// Attachs
		let attMap = await tmpDoc.attachments();
        if (attMap.size) msg.attachments = [];
        for (let [key, value] of attMap) {
			let buf = await value.fileStream;
			buf = dSession.node.inNode ? Buffer.from(buf) : utils.newSimpleBuffer(buf);
            msg.attachments.push({
                filename: key,
                content: buf,
            });
        }

		addMsgFooters(msg);
		resolve(msg);

		async function evalCode(code) {
            var pipe = {};
            eval(`pipe.fn = async () => {\n\n${code}\n};`);
            await pipe.fn();
        }
	});
}

/**
Alias de messageFromTemplate
*/
export function msgFromTemp() {
	return messageFromTemplate(...arguments);
}

/**
Devuelve un nuevo mensaje precargado con from y replyTo validos.

@returns {Promise<Object>}
*/
export async function newMessage() {
	var msg = {};
	var usr = await dSession.currentUser;
	msg.from = '"' + usr.name + '" <notificaciones@cloudycrm.net>';
	msg.replyTo = '"' + usr.name + '" <' + usr.email + '>';
	return msg;
}

/**
Alias de newMessage.

@returns {Promise<Object>}
*/
export async function newMsg() {
	return newMessage();
}


export async function replaceMsgTokens(msg, tokens) {
	await importEscapeRegExp();
	for (let [key, value] of tokens) {
		var regExp = new RegExp(escapeRegExp(key), 'ig'); // Case insensitive, global
		if (msg.subject) msg.subject = msg.subject.replace(regExp, value);
		if (msg.text) msg.text = msg.text.replace(regExp, value);
		if (msg.html) msg.html = msg.html.replace(regExp, value);
	}
}

/**
Retorna el outbox de ServiceHub
*/
export async function serviceHubOutbox() {
	let shSession = new dSession.constructor('https://servicehub.cloudycrm.net/restful');
	shSession.apiKey = dSession.utils.decrypt('U2FsdGVkX18q1PC4O1LIC/ufEdmd9YMbEw24zZsggj7fhicTFK/bQ966CCEASj' + 
		'QMK93FNymrdnNJKqIA7XduFjJh+VgSNSUkbbIFb0tKMAhRSSCLkjeTCq7EflOsgEg59myN+1k3MkZNIaZxEC2nZA==', '');
	return await shSession.folder('/outbox');
}

/**
Manda un mail via outbox.
Si tiene fecha programada (date) o viaHub es true se envia a través del ServiceHub.
En caso contrario busca la carpeta outbox local, si no la encuentra envía por ServiceHub.
La estructura de message es la de nodemailer (https://nodemailer.com/message/).

options = {
	draft // Lo guarda como borrador (def false)
	date // Fecha de envio programada. Si viene se fuerza el envío por ServiceHub.
	docId // Id del documento relacionado a la notificacion (def el actual)
	delPrev // Indica si se borran mensajes previos para el mismo docId y subject (def true)
	viaHub // Fuerza el envio por Service Hub (def false)
}
*/
export async function sendMailAsync(message, options) {
	var opt = {
		draft: false,
		docId: doc ? doc.id : null,
		delPrev: true,
		viaHub: false,
	};
	Object.assign(opt, options);

	let viaHub = opt.viaHub;

	if (opt.date) {
		opt.date = utils.cDate(opt.date);
		if (opt.date > new Date()) {
			viaHub = true;
		} else {
			throw new Error('date debe ser una fecha futura');
		}
	}

	let outbox;
	if (!viaHub) {
		try { outbox = await dSession.folder('/outbox') } catch(err) {};
	}
	if (!outbox) outbox = await serviceHubOutbox();
	
	//console.log('sendMailAsync antes de newDoc', consTags);
	var docMsg = await outbox.newDoc();
	//console.log('sendMailAsync dps de newDoc', consTags);

	if (message.from) docMsg.fields('from').value = message.from;
	if (message.replyTo) docMsg.fields('replyto').value = message.replyTo;
	if (message.to) docMsg.fields('to').value = message.to;
	if (message.cc) docMsg.fields('cc').value = message.cc;
	if (message.bcc) docMsg.fields('bcc').value = message.bcc;
	if (message.subject) docMsg.fields('subject').value = message.subject;
	if (message.html) docMsg.fields('htmlbody').value = message.html;
	if (message.text) docMsg.fields('textbody').value = message.text;
	if (opt.date) docMsg.fields('date').value = opt.date;
	if (docMsg.fields().has('ref_instance')) docMsg.fields('ref_instance').value = (await dSession.instance).Name;
	if (docMsg.fields().has('ref_ins_guid')) docMsg.fields('ref_ins_guid').value = (await dSession.settings('instance_guid'));

	if (opt.docId && docMsg.fields().has('ref_doc_id')) {
		docMsg.fields('ref_doc_id').value = opt.docId;

		var delFil = 'ref_doc_id = ' + docMsg.fields('ref_doc_id').value + 
		' and ref_ins_guid = ' + dSession.db.sqlEnc(docMsg.fields('ref_ins_guid').value, 1) +
		' and subject = ' + dSession.db.sqlEnc(docMsg.fields('subject').value, 1) + 
		' and sent is null';
	}

	var atts = message.attachments;
	if (atts && Array.isArray(atts)) {
		// Lo guardo en draft para que no se envie mientras subo los adjuntos
		docMsg.fields('draft').value = 1;
		await docMsg.save();

		await utils.asyncLoop(atts.length, async loop => {
			let el = atts[loop.iteration()];
			let att = docMsg.attachmentsAdd(el.filename);
			att.fileStream = el.content;
			await att.save();
			loop.next();
		});
	}

	docMsg.fields('draft').value = opt.draft ? 1 : 0;

	if (docMsg.isNew || docMsg.fields('draft').valueChanged) {
		await docMsg.save();
	};

	if (opt.delPrev && opt.docId && delFil) {
		delFil += ' and doc_id <> ' + docMsg.id;
		await outbox.documentsDelete(delFil);
	}

	//console.log('senMailAsync end', consTags);
	return docMsg;
}

/**
Cancela el envío de un mail programado.

options = {
	docId // Id del documento relacionado a la notificacion (def el actual)
	subject // Subject del mail programado
}
*/
export async function cancelMailAsync(options) {
	var opt = {
		docId: doc ? doc.id : null,
	};
	Object.assign(opt, options);

	if (!opt.docId) throw new Error('docId es requerido');
	if (!opt.subject) throw new Error('subject es requerido');

	let outbox = await serviceHubOutbox();
	
	let delFil = 'ref_doc_id = ' + opt.docId + 
		' and ref_ins_guid = ' + dSession.db.sqlEnc((await dSession.settings('instance_guid')), 1) +
		' and subject = ' + dSession.db.sqlEnc(opt.subject, 1) + 
		' and sent is null';

	await outbox.documentsDelete(delFil);
}

/**
Manda un mail (https://nodemailer.com/message/) con transport (https://nodemailer.com/transports/).

Si no se pasa el transport se crea un SMTP Transport (https://nodemailer.com/smtp/),
a partir de CDO_CONFIGURATION.

Devuelve el info (https://nodemailer.com/usage/).
*/
export async function sendMail(message, transport) {
	if (!dSession.node.inNode) {
        return await dSession.node.modCall({
            module: thisMod,
            method: 'sendMail',
            args: message, // transport no se puede serializar
        });
    
    } else {
		if (!transport) {
			// Crea un smtpTransport a partir de CDO_CONFIGURATION y almacena en cache
			var smtpTransport = utils.cache('smtpTransport');

			if (!smtpTransport) {
				let cdoConf = await dSession.settings('CDO_CONFIGURATION');
				let options = {};
				let arr = cdoConf.split(';');

				arr.forEach((el, ix) => {
					let sett = el.split('=');
					sett[0] = sett[0].toLowerCase().trim();
					sett[1] = sett[1].trim();

					if (sett[0] == 'sendusing') {
						if (sett[1] != '2') throw new Error('sendusing must be 2 (cdoSendUsingPort)');

					} else if (sett[0] == 'smtpserver') {
						options.host = sett[1];

					} else if (sett[0] == 'smtpserverport') {
						options.port = sett[1];

					} else if (sett[0] == 'smtpusessl') {
						options.secure = (sett[1] == '1' ? true : false);

					} else if (sett[0] == 'smtpauthenticate') {
						if (sett[1] == '1' && !options.auth) options.auth = {};

					} else if (sett[0] == 'sendusername') {
						if (!options.auth) options.auth = {};
						options.auth.user = sett[1];

					} else if (sett[0] == 'sendpassword') {
						if (!options.auth) options.auth = {};
						options.auth.pass = sett[1];
					}
				})

				// Este hardcode es xq con 25 no funciona
				if (options.host.indexOf('amazonaws') >= 0 && options.secure && options.port == '25') options.port = 465;

				await importNodeMailer();
				smtpTransport = nodemailer.createTransport(options);
				utils.cache('smtpTransport', smtpTransport);
			}

			transport = smtpTransport;
		}

		let info = await transport.sendMail(message);
		return info
	}
}

/**
Devuelve true si el usuario actual pertenece a group (name o id).
@returns {Promise<boolean>}
*/
export async function hasParent(group) {
	return await (await dSession.currentUser).hasParent(group, true);
}

/**
Alias de hasParent
*/
export function perteneceGrupo(group) {
	return hasParent(group);
}

/**
Asigna el valor pDefault a pField si esta vacio.
*/
export function fieldDefault(pField, pDefault) {
	if (pField.valueEmpty) pField.value = pDefault;
}

/**
Alias de fieldDefault
*/
export function fieldDef(pField, pDefault) {
	fieldDefault(pField, pDefault);
}

/**
Schedula un pushMsg. Requiere la carpeta pushSendSched y su correspondiente agente.
Se puede crear el instalador desde el DEV.

@example
pushSendSched({
	date // Fecha/hora en que se quiere enviar el mensaje
	to // Destinatarios (ids separados por coma)
	title // Titulo del mensaje
	body // Cuerpo del mensaje
	data // Data del mensaje (json)
	delPrev // Bool, indica si se borran mensajes previos para el mismo docId y title (def true)
	docId // Id del documento relacionado a la notificacion (def el actual)
	schedFolder // Carpeta pushSendSched (def /pushSendSched)
})
*/
export async function pushSendSched(options) {
	var fldSched, docMsg, delFil;

	var opt = {
		date: null,
		to: null,
		title: null,
		body: null,
		data: null,
		delPrev: true,
		docId: doc ? doc.id : null,
		schedFolder: '/pushSendSched',
	}
	Object.assign(opt, options);

	fldSched = await dSession.folder(opt.schedFolder);
	delFil = 'ref_doc_id = ' + opt.docId + ' and title = ' + dSession.db.sqlEnc(opt.title, 1)
	
	opt.date = utils.cDate(opt.date);
	if (opt.date && opt.date > (new Date()) && opt.to != undefined) {
		docMsg = await fldSched.newDoc();
		docMsg.fields('ref_doc_id').value = opt.docId;
		docMsg.fields('date').value = opt.date;
		docMsg.fields('to').value = opt.to;
		docMsg.fields('title').value = opt.title;
		docMsg.fields('body').value = opt.body;
		if (opt.data) {
			if (!opt.data.guid) opt.data.guid = utils.getGuid();
            docMsg.fields('data').value = dSession.push.stringifyData(opt.data);
        }
		await docMsg.save();
			
		delFil += ' and doc_id <> ' + docMsg.id;
	}

	if (opt.delPrev && opt.docId) await fldSched.documentsDelete(delFil);
	return docMsg;
}

/**
Dispara un error si los valores de pFields (lista separada por comas) del documento
actual ya existen en otro doc de la carpeta (ignora permisos). pScope (opcional) es una
formula que limita el alcance de la verificacion.
*/
export async function claveUnica(pFields, pScope) {
	var arr = pFields.split(',');
	var whr = '';
	var full = true;
	for (var ix in arr) {
		arr[ix] = arr[ix].trim();
		var field = doc.fields(arr[ix]);
		if (!field.valueEmpty) {
			whr += ' and ' + field.name + ' = ' + dSession.db.sqlEnc(field.value, field.type);
		} else {
			full = false;
		}
	}

	if (full) {
		var sql = `select d.DOC_ID, d.SUBJECT from SYS_DOCUMENTS d inner join SYS_FIELDS_${ doc.formId } f 
			on d.DOC_ID = f.DOC_ID where d.FLD_ID = ${ doc.folderId } and d.DOC_ID <> ${ doc.id } ${ whr }`;
		if (pScope) sql += ' and (' + pScope + ')';
		var res = await dSession.db.openRecordset(sql);
		if (res.length > 0) {
			var err = 'Error de clave unica. El documento ';
			if (res[0]['SUBJECT']) {
				err += `'${res[0]['SUBJECT']}' (#${res[0]['DOC_ID']})`;
			} else {
				err += '#' + res[0]['DOC_ID'];
			}
			err += ' ya tiene ese valor de [' + arr.join(' + ') + ']';

			addError(err);
		}
	}
}

/*

' Devuelve True si cambio el valor de alguno de los campos especificados en pFields (lista separada por comas)
Function ValuesChanged(pDoc, pFields)
	Dim i, changed, arrF
	
	ValuesChanged = False
	arrF = Split(pFields, ",")
	For i = 0 To UBound(arrF)
		If doc(Trim(arrF(i))).ValueChanged Then
			ValuesChanged = True
			Exit Function
		End If
	Next
End Function


Function AttEnc(pValue)
	Dim ret
	
    'todo: que pasa si no tengo Server? Buscar un algoritmo que trabaje con el codepage
    ret = Server.HtmlEncode(pValue & "")
	ret = Replace(ret, """", "&quot;")
	ret = Replace(ret, "'", "&#39;")
	'ret = Replace(ret, "&", "&amp;")
	'ret = Replace(ret, "<", "&lt;")
	'ret = Replace(ret, ">", "&gt;")
	AttEnc = ret
End Function

*/