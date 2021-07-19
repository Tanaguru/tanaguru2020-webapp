const ModuleHelper = {
    getModuleName(module){
        var traductions = module.i18n;
        return traductions[this.$i18n.locale] ? traductions[this.$i18n.locale] : module.name;
    }
};

export default ModuleHelper;