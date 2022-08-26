const setWidgetSettings = AVT_CREATOR_CENTRAL_API.setWidgetSettings;
const getWidgetSettings = AVT_CREATOR_CENTRAL_API.getWidgetSettings;
const setPackageSettings = AVT_CREATOR_CENTRAL_API.setPackageSettings;
const getPackageSettings = AVT_CREATOR_CENTRAL_API.getPackageSettings;
const changeTitle = AVT_CREATOR_CENTRAL_API.changeTitle;
const changeImage = AVT_CREATOR_CENTRAL_API.changeImage;
const changeState = AVT_CREATOR_CENTRAL_API.changeState;
const sendToPackage = AVT_CREATOR_CENTRAL_API.sendToPackage;

const propertyEvents = new EventEmitter();
AVT_CREATOR_CENTRAL.on('sendToPropertyView', receive_from_widget);
AVT_CREATOR_CENTRAL.on('connected', property_main);
AVT_CREATOR_CENTRAL.on('didReceiveWidgetSettings', data => {debugLog(data)});
AVT_CREATOR_CENTRAL.on('didReceivePackageSettings', data => {debugLog(data)});
AVT_CREATOR_CENTRAL.on('keyDown', data => {debugLog(data)});
AVT_CREATOR_CENTRAL.on('keyUp', data => {debugLog(data)});
AVT_CREATOR_CENTRAL.on('widgetTriggered', data => {debugLog(data)});
AVT_CREATOR_CENTRAL.on('widgetWillAppear', data => {debugLog(data)});
AVT_CREATOR_CENTRAL.on('widgetWillDisappear', data => {debugLog(data)});
AVT_CREATOR_CENTRAL.on('propertyViewDidAppear', data => {debugLog(data)});
AVT_CREATOR_CENTRAL.on('propertyViewDidDisappear', data => {debugLog(data)});

let saveData = [];
function setSaveData(idKey, id, data) {
	let hasKey = false;
	for (const i in saveData) {
		if (Object.hasOwnProperty.call(saveData[i], idKey) && saveData[i][idKey] === id) {
			saveData[i] = data;
			hasKey = true;
		}
	}
	if(!hasKey) {
		saveData.push(data);
	}
	setWidgetSettings({
		'saveData' : saveData
	});
}

function property_main(data) {
	console.log('property_main........');
	sendToPackage({
		'action': 'propertyConnect'
	})
}

function receive_from_widget(data) {
	if(data.payload.hasOwnProperty('action')) {
		let action = data.payload.action;
		propertyEvents.emit(action, data.payload);
	} else {
		console.log('unknown action: ', data)
	}
}

propertyEvents.on('set_select_item', data => {
	console.log(data);
	$('#'+data.select_name.id).text(data.select_name.name);
	let option_id = data.select_options.id;
	let select_option = $('#'+option_id);
	let options = data.select_options.options;
	let defaultData = {
		'action' : 'get_select_option',
		'option_id': option_id	
	};
	select_option.html('');
	if(data.select_options['placeholder']) {
		select_option.append('<option disabled selected style="display:none;">' + data.select_options['placeholder'] + '</option>');
	}
	for(let i=0; i < options.length; i++) {
		select_option.append('<option value="' + options[i].value + '">' + options[i].name + '</option>');
	}
	if(data.select_options.hasOwnProperty('default_value')) {
		select_option.val(data.select_options.default_value);	
		defaultData['option_val'] = data.select_options.default_value;
	}
	if(data.select_options['disabled']) {
		select_option.prop('disabled', true);
	} else {
		select_option.prop('disabled', false);
	}
	
	select_option.on('change', e => {
		setSaveData('option_id', option_id,{
			'action' : 'get_select_option',
			'option_id': option_id,
			'option_val': e.target.value, 		
		});  
	});
	
	for(let selbtn of ['select_button_1', 'select_button_2', 'select_button_3']) {
		if(data.hasOwnProperty(selbtn)) {
			let select_button = $('#'+data[selbtn].id);
			if(select_button && select_button.length > 0) {
				let visibility = (data[selbtn]['visibility'] && data[selbtn]['visibility'].match(/hidden|none|hide|false/)) ? 'hidden' : '';
				if(data[selbtn]['tooltip'] && !visibility) {
					select_button.wrapAll('<span class="tooltip">');
					select_button.after('<span class="tooltiptext">' + data[selbtn]['tooltip'] + '</span>');
				}
				select_button.css('visibility', visibility);
				select_button.css('opacity', 100);
				select_button = select_button[0];
				select_button.src = data[selbtn].src;
				if(data[selbtn]['action'] == 'file_upload') {
					let upfile = select_option.next();
					$(select_button).on('click', e => upfile.trigger('click'));					
					$(upfile).change(e => { 
						let file = upfile.val();
						if($(select_option).find('option[value="' + file +'"]').length == 0) {
							select_option.append('<option value="'+ file +'">' + file + '</option>');
						}
						select_option.val(file); 
						setSaveData('button_id', data[selbtn].id, {
							'action' : 'on_file_upload',
							'button_id': data[selbtn].id,
							'file': file,
						}); 						
					});
				} else {
	
					$(select_button).on('click', e => {
						console.log('click changed', e.target);
						setSaveData('button_id', data[selbtn].id,{
							'action' : 'on_button_clicked',
							'button_id': data[selbtn].id,
							'clicked': true, 		
						});  
					});
				}
			}
		}
	}
})

propertyEvents.on('set_select_option', data => {
	$('#'+data.option_id).val(data.option_val);
})

propertyEvents.on('get_select_option', data => {
	let option_val = $('#'+data.option_id).val();
	setSaveData('option_id', data.option_id, {
		'action' : 'get_select_option',
		'option_id': data.option_id,
		'option_val': option_val, 			
	});
})

propertyEvents.on('set_radio_button', data => {
	$('#'+data.radio_name.id).text(data.radio_name.name);
	let radio_id = data.radio_options.id;
	let radio_option = $('#'+radio_id);
	let defaultData = {
		'action' : 'get_radio_option',
		'option_id': radio_id		
	};
	radio_option.html('');

	let options = data.radio_options.options;
	for(let i=0; i < options.length; i++) {
		radio_option.append('<label class="avt-item-label"><input type="radio" name="' + data.radio_options.id + '" value="' + options[i].value + '">' + options[i].name + '</input></label>');
	}
	if(data.radio_options.hasOwnProperty('default_value')) {
		$('input:radio[name="' + radio_id + '"]').filter('[value="' + data.radio_options.default_value + '"]').attr('checked', true);
		defaultData['option_val'] = data.radio_options.default_value;
	}
	
	radio_option.on('change', e => {
		let radio_val = $('input[name="' + radio_id + '"]:checked').val(); 
		setSaveData('button_id', radio_id, {
			'action' : 'get_radio_option',
			'option_id': radio_id,
			'option_val': radio_val, 			
		});
	});
})

propertyEvents.on('set_lable_item', data => {
	let lableItem = $('#'+data.label_name.id);
	lableItem.text(data.label_name.name);
	if(data.label_name.hasOwnProperty('font_size')) {
		lableItem.css('font-size', data.label_name.font_size);
	}
	if(data.label_name.hasOwnProperty('color')) {
		lableItem.css('color', data.label_name.color);
	}
	
	let partentDiv = $(lableItem).parent();
	if(data.align == 'right') {
		partentDiv.css('margin-left', 'auto');
	} else {
		partentDiv.css('margin-left', '');
	}
	for(let labelbtn of ['label_button_1', 'label_button_2', 'label_button_3']) {
		if(data.hasOwnProperty(labelbtn)) {
			let label_button = $('#'+data[labelbtn].id);
			if(label_button && label_button.length > 0) {
				let visibility = (data[labelbtn]['visibility'] && data[labelbtn]['visibility'].match(/hidden|none|hide|false/)) ? 'hidden' : '';
				if(data[labelbtn]['tooltip'] && !visibility) {
					label_button.wrapAll('<span class="tooltip">');
					label_button.after('<span class="tooltiptext">' + data[labelbtn]['tooltip'] + '</span>');
				}
				label_button.css('visibility', visibility);
				label_button.css('opacity', 100);
				label_button = label_button[0];
				label_button.src = data[labelbtn].src;
				$(label_button).on('click', e => {
					setSaveData('button_id', data[labelbtn].id,{
						'action' : 'on_button_clicked',
						'button_id': data[labelbtn].id,
						'clicked': true, 		
					}); 
				});
			}
		}
	}
})

propertyEvents.on('set_button', data => {
	let is_margined = false;
	for(let btn of ['button_1', 'button_2', 'button_3']) {
		if(data.hasOwnProperty(btn)) {
			let button = $('#'+data[btn].id);
			button.text(data[btn].name);
			if(!is_margined) {
				is_margined = true;
				let partentDiv = $(button).parent();
				if(data.align == 'right') {
					partentDiv.css('margin-right', '');
					partentDiv.css('margin-left', 'auto');
				} else if(data.align == 'center') {
					partentDiv.css('margin-right', 'auto');
					partentDiv.css('margin-left', 'auto');
				} else {
					partentDiv.css('margin-right', 'auto');
					partentDiv.css('margin-left', '');
				}				
			}
			$(button).on('click', e => {
				setSaveData('button_id', data[btn].id,{
					'action' : 'on_button_clicked',
					'button_id': data[btn].id,
					'clicked': true, 		
				});
			});			
		}
	}
});


propertyEvents.on('set_checkbox', data => {
	$('#' + data.checkbox.id + ' > span').text(data.checkbox.name);
	let checkbox = $('#' + data.checkbox.id + ' > input[type="checkbox"]');
	let checked = (data.checkbox.checked?true:false);
	checkbox.prop("checked", checked);
	let retData = {
		'action' : 'on_checkbox_clicked',
		'checkbox_id': data.checkbox.id,
		'checked': checked, 			
	}
	checkbox.on('click', e => {
		retData['checked'] = $(checkbox).prop('checked');
	});
})


propertyEvents.on('set_texteditor', data => {
	$('#' + data.label_name.id).text(data.label_name.name);
	let textItem = $('#' + data.texteditor.id);
	let texteditor = $('#' + data.texteditor.id + ' > textarea');
	let oldVal = "";
	let defaultData = {
		'action' : 'on_texteditor_changed',
		'texteditor_id': data.texteditor.id,
		'text_content': '', 		
	};

	if(data.texteditor.hasOwnProperty('text')) {
		texteditor.val(data.texteditor.text);
		defaultData['text_content'] = data.texteditor.text;
	}

	if(data.texteditor.hasOwnProperty('max_length')) {
		texteditor.attr('maxlength', data.texteditor.max_length);
		textItem.find('.avt-item-value-helper').remove();
		texteditor.after('<label class="avt-item-value-helper">'+ texteditor.val().length + '/' + data.texteditor.max_length +'</label>');
	}

	texteditor.on("change keyup paste", function() {
		let currentVal = $(texteditor).val();
		if(currentVal == oldVal) {
			return; //check to prevent multiple simultaneous triggers
		}
		oldVal = currentVal;
		textItem.find('.avt-item-value-helper').text((currentVal.length + '/' + data.texteditor.max_length));
		setSaveData('texteditor_id', data.texteditor.id, {
			'action' : 'on_texteditor_changed',
			'texteditor_id': data.texteditor.id,
			'text_content': currentVal, 			
		});
	});

	for (const key in data) {
		if (key.includes('set_texteditor_button')) {
			let input_button = $('#'+data[key].id);
			if(input_button && input_button.length > 0) {
				let visibility = (data[key]['visibility'] && data[key]['visibility'].match(/hidden|none|hide|false/)) ? 'hidden' : '';
				if(data[key]['tooltip'] && !visibility) {
					input_button.wrapAll('<span class="tooltip">');
					input_button.after('<span class="tooltiptext">' + data[key]['tooltip'] + '</span>');
				}
				input_button.css('visibility', visibility);
				input_button.css('opacity', 100);
				input_button = input_button[0];
				input_button.src = data[key].src;
				$(input_button).on('click', e => {
					setSaveData('button_id', data[key].id,{
						'action' : 'on_button_clicked',
						'button_id': data[key].id,
						'clicked': true, 		
					}); 
				});
			}
			
		}
	}


});

propertyEvents.on('set_number', data => {
	$('#' + data.label_name.id).text(data.label_name.name);
	let numberEditor = $('#' + data.number.id + ' > input');
	let oldVal = "";
	let defaultData = {
		'action' : 'on_number_editor_changed',
		'number_id': data.number.id,
		'text_content' : 0
	};
	if(data.hasOwnProperty('default_value')) {
		numberEditor.val(data.default_value);
		defaultData['text_content'] = data.default_value;
	}
	
	numberEditor.on("change keyup paste", function() {
			let currentVal = $(numberEditor).val();
			if(currentVal == oldVal) {
					return; //check to prevent multiple simultaneous triggers
			}
			oldVal = currentVal;
			setSaveData('number_id', data.number.id, {
				'action' : 'on_number_editor_changed',
				'number_id': data.number.id,
				'text_content': Number(currentVal),
			});

	});
})

propertyEvents.on('set_input_text', data => {
	let lableItem = $('#'+data.label_name.id);
	lableItem.text(data.label_name.name);
	let oldVal = "";
	let input_text;

	if(data.input_text) {
		input_text = $('#' + data.input_text.id);
		let retData = {
			'action' : 'on_input_text_changed',
			'input_text_id': data.input_text.id,
			'input_content': '', 		
		};

		if(data.input_text && data.input_text.hasOwnProperty('text')) {
			oldVal = data.input_text.text;
			input_text.val(data.input_text.text);
			retData['input_content'] = data.input_text.text;
		}

		input_text.on("change keyup paste", function() {
				let currentVal = $(input_text).val();
				if(currentVal == oldVal) {
						return; //check to prevent multiple simultaneous triggers
				}
				oldVal = currentVal;
				retData['input_content'] = currentVal;
				setSaveData('input_text_id', data.input_text.id, retData);
		});
	}

	for (const key in data) {
		if (key.includes('label_name_')) {
			let input_sub_label = $('#'+data[key].id);
			if(input_sub_label && input_sub_label.length > 0) {
				input_sub_label.text(data[key].name);
			}
		}
	}

	for (const key in data) {
		if (key.includes('input_text_')) {
			let input_sub_text = $('#'+data[key].id);
			let _oldVal = '';
			if(input_sub_text && input_sub_text.length > 0) {
				input_sub_text.val(data[key].text);
				_oldVal = data[key].text;

				input_sub_text.on("change keyup paste", function() {
					let currentVal = $(this).val();
					if(currentVal == _oldVal) {
						return; //check to prevent multiple simultaneous triggers
					}
					_oldVal = currentVal;
					setSaveData('input_text_id', data[key].id, {
						'action' : 'on_input_text_changed',
						'input_text_id': data[key].id,
						'input_content': currentVal,
					});
				});
			}
		}
	}

	for(let intxtbtn of ['input_text_button_1', 'input_text_button_2', 'input_text_button_3']) {
		if(data.hasOwnProperty(intxtbtn)) {
			let input_button = $('#'+data[intxtbtn].id);
			if(input_button && input_button.length > 0) {
				let visibility = (data[intxtbtn]['visibility'] && data[intxtbtn]['visibility'].match(/hidden|none|hide|false/)) ? 'hidden' : '';
				if(data[intxtbtn]['tooltip'] && !visibility) {
					input_button.wrapAll('<span class="tooltip">');
					input_button.after('<span class="tooltiptext">' + data[intxtbtn]['tooltip'] + '</span>');
				}
				input_button.css('visibility', visibility);
				input_button.css('opacity', 100);
				input_button = input_button[0];
				input_button.src = data[intxtbtn].src;
				if(data[intxtbtn]['action'] == 'file_upload') {
					let upfile = input_text.next();
					$(input_button).on('click', e => upfile.trigger('click'));					
					input_text.attr('disabled', true);
					$(upfile).change(e => { 
						input_text.val(upfile.val()); 
						setSaveData('button_id', data[intxtbtn].id, {
							'action' : 'on_file_upload',
							'button_id': data[intxtbtn].id,
							'file': upfile.val(),
						}); 						
					});
				} else {
					$(input_button).on('click', e => {
						setSaveData('button_id', data[intxtbtn].id,{
							'action' : 'on_button_clicked',
							'button_id': data[intxtbtn].id,
							'clicked': true, 		
						}); 
					});
				}
			}
		}
	}
})

function setTimerSelectOptions(select, bound){ 
	for(let i=0; i < bound; i++){
		if(i < 10){
			select.append(`<option value="0${i}">0${i}</option>`);
		}else{
			select.append(`<option value="${i}">${i}</option>`);
		}
	};
} 	

propertyEvents.on('set_timer', data => {
	let lableItem = $('#'+data.label_name.id);
	lableItem.text(data.label_name.name);
	let retData = {
		'action' : 'on_timer_changed',
		'timer_id': data.timer.id,
		'type': data.type,
	}

	let hr, min, sec, ampm;
	let type = data.type;
	let timer = $('#' + data.timer.id + ' select.time_collection');
	if(+type == 12) {
		hr = $(timer[0]);
		setTimerSelectOptions(hr, 13);
		if(data.timer['hr']) { 
			hr.val(data.timer['hr']); 
		}
		min = $(timer[1]);
		setTimerSelectOptions(min, 60);
		if(data.timer['min']) { 
			min.val(data.timer['min']); 
		}
		ampm = $(timer[2]); 
		if(data.timer['ampm']) { 
			ampm.val(data.timer['ampm']); 
		}
		//Save data
		retData['hr'] = hr.val();
		retData['min'] = min.val();
		retData['ampm'] = ampm.val();
		
		//Save data onchange
		for(let timer_item of [hr, min, ampm]) {
			timer_item.change(e => {
				retData['hr'] = hr.val();
				retData['min'] = min.val();
				retData['ampm'] = ampm.val();
				setSaveData('timer_id', data.timer.id, retData);
			});
		}
	} else {
		hr = $(timer[0]);
		setTimerSelectOptions(hr, 24);
		if(data.timer['hr']) { 
			hr.val(data.timer['hr']); 
		}
		min = $(timer[1]);
		setTimerSelectOptions(min, 60);
		if(data.timer['min']) { 
			min.val(data.timer['min']); 
		}
		sec = $(timer[2]); 
		setTimerSelectOptions(sec, 60);
		if(data.timer['sec']) { 
			sec.val(data.timer['sec']); 
		}		

		//Save data onchange
		for(let timer_item of [hr, min, sec]) {
			timer_item.change(e => {
				retData['hr'] = hr.val();
				retData['min'] = min.val();
				retData['sec'] = sec.val();
				setSaveData('timer_id', data.timer.id, retData);
			});
		}
	}
});

