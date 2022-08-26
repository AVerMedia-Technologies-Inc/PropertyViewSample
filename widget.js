const setWidgetSettings = AVT_CREATOR_CENTRAL_API.setWidgetSettings;
const getWidgetSettings = AVT_CREATOR_CENTRAL_API.getWidgetSettings;
const setPackageSettings = AVT_CREATOR_CENTRAL_API.setPackageSettings;
const getPackageSettings = AVT_CREATOR_CENTRAL_API.getPackageSettings;
const sendToPropertyView = AVT_CREATOR_CENTRAL_API.sendToPropertyView;

AVT_CREATOR_CENTRAL.on('connected', () => { });
AVT_CREATOR_CENTRAL.on('sendToPackage', data => {
    // ==================================  Input ================================== 
    sendToPropertyView({
        'action': 'set_input_text',
        'label_name': {
            'id': 'input_text_1_name',
            'name': 'Title',
        },
        'input_text': {
            'id': 'input_text_1',
            'text': 'Monitor'
        }
    });

    sendToPropertyView({
        'action': 'set_input_text',
        'label_name': {
            'id': 'input_text_2_name',
            'name': 'Title',
        },
        'input_text': {
            'id': 'input_text_2',
            'text': 'Monitor'
        },
        'input_text_button_1': {
            'id': 'input_text_2_button_1',
            'src': 'images/component_btn_infor_block_n.svg',
            'tooltip': 'Tooltip message'
        },
    });

    sendToPropertyView({
        'action': 'set_input_text',
        'label_name': {
            'id': 'input_text_3_name',
            'name': 'Title',
        },
        'input_text': {
            'id': 'input_text_3',
            'text': 'Monitor'
        },
        'input_text_button_1': {
            'id': 'input_text_3_button_1',
            'src': 'images/component_btn_point_block_b_n.svg',
            'action': 'file_upload'
        },
        'input_text_button_2': {
            'id': 'input_text_3_button_2',
            'src': 'images/component_btn_fault.svg',
            // 'visibility': 'hidden', // [show or hidden]
        },
    });

    sendToPropertyView({
        'action': 'set_input_text',
        'label_name': {
            'id': 'input_text_4_name',
            'name': 'Title',
        },
        'input_text': {
            'id': 'input_text_4',
            'text': 'Monitor'
        },
        'input_text_button_1': {
            'id': 'input_text_4_button_1',
            'src': 'images/component_btn_point_block_b_n.svg',
            'action': 'file_upload'
        },
        'input_text_button_2': {
            'id': 'input_text_4_button_2',
            'src': 'images/component_btn_delete_block_n.svg',
        },
        'input_text_button_3': {
            'id': 'input_text_4_button_3',
            'src': 'images/component_btn_fault.svg',
            // 'visibility': 'hidden', // [show or hidden]
        },
    });

    sendToPropertyView({
        'action': 'set_input_text',
        'label_name': {
            'id': 'input_text_5_name',
            'name': 'Title',
        },
        'input_text': {
            'id': 'input_text_5',
            'text': 'Monitor'
        },
        'input_text_button_1': {
            'id': 'input_text_5_button_1',
            'src': 'images/component_btn_refresh_block_b_n.svg',
        },
    });

    sendToPropertyView({
        'action': 'set_input_text',
        'label_name': {
            'id': 'input_text_6_name',
            'name': 'Title',
        },
        'input_text': {
            'id': 'input_text_6',
            'text': 'Monitor'
        },
        'input_text_button_1': {
            'id': 'input_text_6_button_1',
            'src': 'images/component_btn_restore_block_b_n.svg',
        },
        'input_text_button_2': {
            'id': 'input_text_6_button_2',
            'src': 'images/component_btn_refresh_block_b_n.svg',
        },
    });

    sendToPropertyView({
        'action': 'set_input_text',
        'label_name': {
            'id': 'input_text_row_1_name',
            'name': 'URL',
        },
        'input_text': {
            'id': 'input_text_row_1',
            'text': 'http://codereview-new.avermedia.com:8081/q/status:open',
        },
        'input_text_button_1': {
            'id': 'input_text_row_1_button_1',
            'src': 'images/component_btn_restore_block_b_n.svg',
        },
    });
    sendToPropertyView({
        'action': 'set_input_text',
        'label_name': {
            'id': 'input_text_row_2_name',
            'name': 'Size',
        },
        'label_name_1': {
            'id': 'input_text_row_2_sub_name_1',
            'name': 'W',
        },
        'label_name_2': {
            'id': 'input_text_row_2_sub_name_2',
            'name': 'H',
        },
        'input_text_1': {
            'id': 'input_text_row_sub_1',
            'text': '800',
        },
        'input_text_2': {
            'id': 'input_text_row_sub_2',
            'text': '600',
        },
        'input_text_button_1': {
            'id': 'input_text_row_2_button_1',
            'src': 'images/component_btn_restore_block_b_n.svg',
        },
        'input_text_button_2': {
            'id': 'input_text_row_2_button_2',
            'src': 'images/component_btn_restore_block_b_n.svg',
        },
    });

    //================================== ComboBox =================================
    sendToPropertyView({
        'action': 'set_select_item',
        'select_name': {
            'id': 'select_1_name',
            'name': 'menu-1'
        },
        'select_options': {
            'id': 'select_1_options',
            // 'default_value': 'select-1-value-5',
            'options': [
                { 'value': 'select-1-value-1', 'name': 'menu-1-option-1' },
                { 'value': 'select-1-value-2', 'name': 'menu-1-option-2' },
                { 'value': 'select-1-value-3', 'name': 'menu-1-option-3' },
                { 'value': 'select-1-value-4', 'name': 'menu-1-option-4' },
            ]
        }
    });

    sendToPropertyView({
        'action': 'set_select_item',
        'select_name': {
            'id': 'select_2_name',
            'name': 'menu/button-2'
        },
        'select_options': {
            'id': 'select_2_options',
            // 'disabled': true,  
            'placeholder': 'Please select an option',
            'options': [
                { 'value': 'select-2-value-1', 'name': 'menu-2-option-1' },
                { 'value': 'select-2-value-2', 'name': 'menu-2-option-2' },
                { 'value': 'select-2-value-3', 'name': 'menu-2-option-3' },
                { 'value': 'select-2-value-4', 'name': 'menu-2-option-4' },
            ]
        },
        'select_button_1': {
            'id': 'select_2_button_1',
            'src': 'images/component_btn_addnew_block_nc_m.svg',
            'tooltip': 'select_button_1'
        },
        'select_button_2': {
            'id': 'select_2_button_2',
            'src': 'images/component_btn_refresh_block_nc_m.svg',
            // 'visibility': 'hidden', // [show or hidden]
        },
    });

    sendToPropertyView({
        'action': 'set_select_item',
        'select_name': {
            'id': 'select_3_name',
            'name': 'menu/button-3'
        },
        'select_options': {
            'id': 'select_3_options',
            'options': [
                { 'value': 'select-3-value-1', 'name': 'menu-3-option-1' },
                { 'value': 'select-3-value-2', 'name': 'menu-3-option-2' },
                { 'value': 'select-3-value-3', 'name': 'menu-3-option-3' },
                { 'value': 'select-3-value-4', 'name': 'menu-3-option-4' },
            ]
        },
        'select_button_1': {
            'id': 'select_3_button_1',
            'src': 'images/component_btn_addnew_block_nc_m.svg',
        },
    });

    sendToPropertyView({
        'action': 'set_select_item',
        'select_name': {
            'id': 'select_4_name',
            'name': 'Title'
        },
        'select_options': {
            'id': 'select_4_options',
            // 'default_value': 'select-4-value-1',
            'options': [
                { 'value': 'monitor', 'name': 'Monitor' },
                { 'value': 'select-4-value-1', 'name': 'menu-4-option-1' },
                { 'value': 'select-4-value-2', 'name': 'menu-4-option-2' },
            ]
        },
        'select_button_1': {
            'id': 'select_4_button_1',
            'src': 'images/component_btn_point_block_b_n.svg',
            'action': 'file_upload'
        },
        'select_button_2': {
            'id': 'select_4_button_2',
            'src': 'images/component_btn_delete_block_n.svg',
        },
        'select_button_3': {
            'id': 'select_4_button_3',
            'src': 'images/component_btn_fault.svg',
            // 'visibility': 'hidden', // [show or hidden]
        }
    });
    sendToPropertyView({
        'action': 'set_select_item',
        'select_name': {
            'id': 'select_5_name',
            'name': 'Title'
        },
        'select_options': {
            'id': 'select_5_options',
            // 'default_value': 'select-5-value-1',
            'options': [
                { 'value': 'monitor', 'name': 'Monitor' },
                { 'value': 'select-5-value-1', 'name': 'menu-5-option-1' },
                { 'value': 'select-5-value-2', 'name': 'menu-5-option-2' },
            ]
        },
        'select_button_1': {
            'id': 'select_5_button_1',
            'src': 'images/component_btn_refresh_block_b_n.svg',
        },
        'select_button_2': {
            'id': 'select_5_button_2',
            'src': 'images/component_btn_fault.svg',
            // 'visibility': 'hidden', // [show or hidden]
        }
    });

    sendToPropertyView({
        'action': 'set_select_item',
        'select_name': {
            'id': 'select_6_name',
            'name': 'Title'
        },
        'select_options': {
            'id': 'select_6_options',
            // 'default_value': 'select-6-value-1',
            'options': [
                { 'value': 'monitor', 'name': 'Monitor' },
                { 'value': 'select-6-value-1', 'name': 'menu-6-option-1' },
                { 'value': 'select-6-value-2', 'name': 'menu-6-option-2' },
            ]
        },
        'select_button_1': {
            'id': 'select_6_button_1',
            'src': 'images/component_btn_addnew_block_b_n.svg',
        },
        'select_button_2': {
            'id': 'select_6_button_2',
            'src': 'images/component_btn_fault.svg',
            // 'visibility': 'hidden', // [show or hidden]
        }
    });

    sendToPropertyView({
        'action': 'set_select_item',
        'select_name': {
            'id': 'select_7_name',
            'name': 'Title'
        },
        'select_options': {
            'id': 'select_7_options',
            // 'default_value': 'select-7-value-1',
            'options': [
                { 'value': 'monitor', 'name': 'Monitor' },
                { 'value': 'select-7-value-1', 'name': 'menu-7-option-1' },
                { 'value': 'select-7-value-2', 'name': 'menu-7-option-2' },
            ]
        },
        'select_button_1': {
            'id': 'select_7_button_1',
            'src': 'images/component_btn_addnew_block_b_n.svg',
        },
        'select_button_2': {
            'id': 'select_7_button_2',
            'src': 'images/component_btn_refresh_block_b_n.svg',
        },
        'select_button_3': {
            'id': 'select_7_button_3',
            'src': 'images/component_btn_fault.svg',
            // 'visibility': 'hidden', // [show or hidden]
        }
    });
    sendToPropertyView({
        'action': 'set_select_item',
        'select_name': {
            'id': 'select_8_name',
            'name': 'Title'
        },
        'select_options': {
            'id': 'select_8_options',
            // 'default_value': 'select-8-value-1',
            'options': [
                { 'value': 'monitor', 'name': 'Monitor' },
                { 'value': 'select-8-value-1', 'name': 'menu-8-option-1' },
                { 'value': 'select-8-value-2', 'name': 'menu-8-option-2' },
            ]
        },
        'select_button_1': {
            'id': 'select_8_button_1',
            'src': 'images/component_btn_fault.svg',
            // 'visibility': 'hidden', // [show or hidden]
        }
    });

    // ==================================  Radio ================================== 

    sendToPropertyView({
        'action': 'set_radio_button',
        'radio_name': {
            'id': 'radio_1_name',
            'name': 'radio name'
        },
        'radio_options': {
            'id': 'radio_1_options',
            'default_value': 'radio-1-value-2',
            // 'disabled': true,
            'options': [
                { 'value': 'radio-1-value-1', 'name': 'Toggle' },
                { 'value': 'radio-1-value-2', 'name': 'On' },
                { 'value': 'radio-1-value-3', 'name': 'Off' },
            ]
        }
    });

    sendToPropertyView({
        'action': 'set_radio_button',
        'radio_name': {
            'id': 'radio_2_name',
            'name': 'select time format'
        },
        'radio_options': {
            'id': 'radio_2_options',
            'default_value': 'radio-2-value-2',
            'options': [
                { 'value': 'radio-2-value-1', 'name': '12 hour clock' },
                { 'value': 'radio-2-value-2', 'name': '24 hour clock' },
            ]
        }
    });

    // ==================================  Button ================================== 
    sendToPropertyView({
        'action': 'set_button',
        'align': 'center',
        'button_1': {
            'id': 'button_1_1',
            'name': 'Button-1_1',
        }
    });

    sendToPropertyView({
        'action': 'set_button',
        'align': 'left',
        'button_1': {
            'id': 'button_2_1',
            'name': 'Button-2_1',
        },
        'button_2': {
            'id': 'button_2_2',
            'name': 'Button-2_2',
        },
    });

    sendToPropertyView({
        'action': 'set_button',
        'align': 'right',
        'button_1': {
            'id': 'button_3_1',
            'name': 'Button-3_1',
        }
    });
    // ==================================  Checkbox ================================== 
    sendToPropertyView({
        'action': 'set_checkbox',
        'checkbox': {
            'id': 'checkbox_1',
            'name': 'Override transition if already in scene',
            'checked': true,
            // 'disabled': true,
        }
    });

    // ==================================  Textarea ================================== 
    sendToPropertyView({
        'action': 'set_texteditor',
        'label_name': {
            'id': 'texteditor_1_name',
            'name': 'Title',
        },
        'texteditor': {
            'id': 'texteditor_1',
            'text': 'Enter some text',
            'max_length': 500,
        }
    });

    sendToPropertyView({
        'action': 'set_texteditor',
        'label_name': {
            'id': 'texteditor_2_name',
            'name': 'Title',
        },
        'texteditor': {
            'id': 'texteditor_2',
            'text': 'Enter some text',
        },
        'set_texteditor_button_1': {
            'id': 'texteditor_text_3_button_1',
            'src': 'images/component_btn_restore_block_b_n.svg',
        },
        'set_texteditor_button_2': {
            'id': 'texteditor_text_3_button_2',
            'src': 'images/component_btn_refresh_block_b_n.svg',
        }
    });

    // ==================================  Integrated elements ================================== 
    // =============================  Timer ========================== 
    sendToPropertyView({
        'action': 'set_timer',
        'type': 12, //12 or 24
        'label_name': {
            'id': 'timer12_1_name',
            'name': 'Set time',
        },
        'timer': {
            'id': 'timer12_1',
            // 'hr':  10,
            // 'min': 45,
            // 'ampm': 'PM',   // AM or PM
        }
    });

    sendToPropertyView({
        'action': 'set_timer',
        'type': 24, //12 or 24
        'label_name': {
            'id': 'timer24_1_name',
            'name': 'Set time',
        },
        'timer': {
            'id': 'timer24_1',
            // 'hr':  11,
            // 'min': 22,
            // 'sec': 33,
        }
    });

    // =============================  Label + Button ========================== 
    sendToPropertyView({
        'action': 'set_lable_item',
        'label_name': {
            'id': 'label_1_name',
            'name': 'Label-1 Name',
        }
    });

    sendToPropertyView({
        'action': 'set_lable_item',
        'align': 'right',
        'label_name': {
            'id': 'label_2_name',
            'name': 'Label-2 Name',
            'font_size': '3px',
            'color': 'yellow',
        },
        'label_button_1': {
            'id': 'label_2_button_1',
            'src': 'images/component_btn_addnew_block_nc_m.svg',
        },
        'label_button_2': {
            'id': 'label_3_button_2',
            'src': 'images/component_btn_addnew_block_nc_m.svg',
        }
    });

});