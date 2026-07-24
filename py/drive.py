import motors


def drive(move, turn):
    vx = move["x"]
    vy = -move["y"]
    omega = turn["x"]

    fl = vy + vx + omega
    fr = vy - vx - omega
    rl = vy - vx + omega
    rr = vy + vx - omega

    values = [fl, fr, rl, rr]
    maximum = max(1, *(abs(v) for v in values))
    fl /= maximum
    fr /= maximum
    rl /= maximum
    rr /= maximum

    motors.set(fl, fr, rl, rr)
