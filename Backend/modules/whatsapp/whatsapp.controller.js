import {sendWhatsappMessage} from "./whatsapp.service.js";
import { generateWhatsappUrl } from './whatsapp.service.js';

export const sendMessage = async (req, res) => {

    const {phone, message} = req.boddy

    try{

        const data = await sendWhatsappMessage(phone, message);
        res.status(200).json({
            ok: true,
            data
        })

    }
    catch (error){
        return res.status(500).json({
            ok:false,
            text: 'error en el servidor',
            err: error
        })
    }
};
