const BreakpointHelper = {
    isBreakpointValid(breakpoint){
        return breakpoint > 0 && breakpoint <= 2048;
    }
};

export default BreakpointHelper;