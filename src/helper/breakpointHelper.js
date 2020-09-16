const BreakpointHelper = {
    isBreakpointEmpty(breakpoint){
        return breakpoint.length != 0
    },
    isBreakpointValid(breakpoint){
        return breakpoint > 0 && breakpoint <= 2048;
    }
};

export default BreakpointHelper;