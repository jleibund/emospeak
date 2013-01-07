if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(function(require) {
        var EventType = function (){ ;
            this.NEUTRAL = '/COG/NEUTRAL';
            this.PUSH = '/COG/PUSH';
            this.PULL = '/COG/PULL';
            this.DROP = '/COG/DROP';
            this.LIFT = '/COG/LIFT';
            this.LEFT = '/COG/LEFT';
            this.RIGHT = '/COG/RIGHT';
            this.ROTATE_LEFT = '/COG/ROTATE_LEFT';
            this.ROTATE_RIGHT = '/COG/ROTATE_RIGHT';
            this.ROTATE_CW = '/COG/ROTATE_CLOCKWISE';
            this.ROTATE_CCW = '/COG/ROTATE_COUNTER_CLOCKWISE';
            this.ROTATE_FWD = '/COG/ROTATE_FORWARD';
            this.ROTATE_BCK = '/COG/ROTATE_REVERSE';
            this.DISAPPEAR = '/COG/DISAPPEAR';
            this.BLINK = '/EXP/BLINK';
            this.LOOK_LEFT = '/EXP/LOOK_LEFT';
            this.LOOK_RIGHT = '/EXP/LOOK_RIGHT';
            this.SMIRK_LEFT = '/EXP/SMIRK_LEFT';
            this.SMIRK_RIGHT = '/EXP/SMIRK_RIGHT';
            this.WINK_LEFT = '/EXP/WINK_LEFT';
            this.WINK_RIGHT = '/EXP/WINK_RIGHT';
            this.EYEBROW = '/EXP/EYEBROW';
            this.SMILE = '/EXP/SMILE';
            this.LAUGH = '/EXP/LAUGH';
            this.FURROW = '/EXP/FURROW';
            this.COPY = '/CONTROL/COPY';
            this.CLEAR = '/CONTROL/CLEAR';
            this.URL = '/CONTROL/URL';
            this.BACKSPACE = '/CONTROL/BACKSPACE';
            this.SUBMIT = '/CONTROL/SUBMIT';
            this.SAY = '/CONTROL/SAY';
            this.SEARCH = '/CONTROL/SEARCH';
            this.NEXTWORD = '/CONTROL/NEXTWORD';
            this.SELECT = '/CONTROL/SELECT';
            this.MODE = '/CONTROL/MODE';
            this.SUGGEST = '/CONTROL/SUGGEST';
            this.GYRO_DELTA = '/GYRO/DELTA';
        }

        return new EventType();
});

