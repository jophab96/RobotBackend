
class Definitions {

    constructor() {

        this.GRIPPER_GRIP_NAME = 'GripperGrip';
        this.GRIPPER_RELEASE_NAME = 'GripperRelease';
        this.MOVE_BASE_NAME = 'MoveBase';
        this.MOVE_ARM_CARTESIAN_NAME = 'MoveArmCartesian';

        this.GRIPPER_GRIP_RPC_NAME = 'trigger_gripper_grip';
        this.GRIPPER_RELEASE_RPC_NAME = 'trigger_gripper_release';
        this.MOVE_BASE_RPC_NAME = 'trigger_move_base';
        this.MOVE_ARM_CARTESIAN_RPC_NAME = 'trigger_move_arm_cartesian';
    }


    get GRIPPER_GRIP_NAME(){

        return 'GripperGrip';
    }

}

exports.Definitions = Definitions;
