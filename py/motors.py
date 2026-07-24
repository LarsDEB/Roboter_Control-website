from fischertechnik.controller.txt4.Txt4ControllerFactory import Txt4ControllerFactory
from fischertechnik.controller.txt4.Txt4MotorFactory import Txt4MotorFactory
from fischertechnik.controller.Motor import Motor

controller = Txt4ControllerFactory().create_graphical_controller()
motor_factory = Txt4MotorFactory()

front_left = motor_factory.create_motor(controller, 1)
front_right = motor_factory.create_motor(controller, 2)
rear_left = motor_factory.create_motor(controller, 3)
rear_right = motor_factory.create_motor(controller, 4)


def _apply(motor, value):
    speed = int((value) * 512)
    motor.set_speed(speed)
    motor.start()


def set(fl, fr, rl, rr):
    _apply(front_left, fl)
    _apply(front_right, -fr)
    _apply(rear_left, rl)
    _apply(rear_right, -rr)
