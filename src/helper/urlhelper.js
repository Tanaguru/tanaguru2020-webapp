const UrlHelper = {
    checkValidUrl(url, projectDomain, mustBeInDomain) {
        let result = false;
        if(url){
            try {
                let parsedUrl = new URL(url);
                let parsedProjectUrl = new URL(projectDomain);
                result = !mustBeInDomain || parsedUrl.hostname.includes(parsedProjectUrl.hostname);
            } catch (_) {
                result = false;
            }
        }
        return result;
    },
};
export default UrlHelper