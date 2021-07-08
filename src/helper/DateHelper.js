const DateHelper = {
    checkValidDate(date) {
        let dateRegex = null;
        let result = false;
        if(this.$i18n.locale.toLowerCase() == 'en'){
            dateRegex = /^(0[1-9]|1[012])[/](0[1-9]|[12][0-9]|3[01])[/](19|20)\d\d$/
        } else { 
            dateRegex = /^(0[1-9]|[12][0-9]|3[01])[/](0[1-9]|1[012])[/](19|20)\d\d$/ 
        }

        if(dateRegex.test(date)){
            result = true;
        } else {
            result = false;
        }
        return result;
    }
}

export default DateHelper;