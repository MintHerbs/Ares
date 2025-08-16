// components/DraggableFab.js
import React, { useMemo, useRef } from 'react';
import { Animated, PanResponder, Pressable, View, Text, useWindowDimensions, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CurrencyConvertor from '../screen/CurrencyConvertor';

export default function DraggableFab({
    size = 56,
    bottomOffset = 100,
    rightOffset = 16,
    label = '💱',
    topSafe = 8,
    margin = 8,
    bottomSafe = 10
}) {
    const nav = useNavigation();
    const { width, height } = useWindowDimensions();

    // start near bottom-right
    const pos = useRef(new Animated.ValueXY({ x: width - (rightOffset + size), y: height - (bottomOffset + size) })).current;
    const tapTime = useRef(0);
    const tapStart = useRef({ t: 0, x: 0, y: 0 });
    const TAP_MS = 520;        // max tap duration
    const MOVE_TOL = 8;

    const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

    const panResponder = useMemo(() => PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        // onStartShouldSetPanResponderCapture: () => true,
        // onMoveShouldSetPanResponderCapture: () => true,
        onPanResponderGrant: (_, g) => {
            tapStart.current = { t: Date.now(), x: g.x0, y: g.y0 };
            pos.setOffset({ x: pos.x.__getValue(), y: pos.y.__getValue() });
            pos.setValue({ x: 0, y: 0 });
        },
        onPanResponderMove: (_, g) => {
            pos.setValue({ x: g.dx, y: g.dy });
        },
        onPanResponderRelease: (_, g) => {
            pos.flattenOffset();

            // current absolute position
            const curX = pos.x.__getValue();
            const curY = pos.y.__getValue();


            const dt = Date.now() - tapStart.current.t;
            const moved = Math.abs(g.moveX - tapStart.current.x) > MOVE_TOL || Math.abs(g.moveY - tapStart.current.y) > MOVE_TOL;
            // console.log(dt);
            // console.log("moved: ", moved)
            if (dt < TAP_MS && !moved) {
                nav.navigate('CurrencyConvertor');
                return;
            }
            // --- snap to nearest edge ---
            // valid bounds inside screen
            const minX = margin;
            const maxX = width - size - margin;
            const minY = margin + topSafe;
            const maxY = height - size - Math.max(margin, bottomSafe);

            // clamp inside screen first
            const x = clamp(curX, minX, maxX);
            const y = clamp(curY, minY, maxY);

            // distances to edges
            const dLeft = Math.abs(x - minX);
            const dRight = Math.abs(maxX - x);
            const dTop = Math.abs(y - minY);
            const dBottom = Math.abs(maxY - y);

            // find closest edge
            const minD = Math.min(dLeft, dRight, dTop, dBottom);
            let targetX = x;
            let targetY = y;
            if (minD === dLeft) targetX = minX;
            else if (minD === dRight) targetX = maxX;
            else if (minD === dTop) targetY = minY;
            else targetY = maxY;

            Animated.spring(pos, {
                toValue: { x: targetX, y: targetY },
                useNativeDriver: false,
                bounciness: 10,
                speed: 20,
            }).start();
        },
    }), [width, height, size, margin, topSafe, bottomSafe, nav, pos]
    );

    return (
        <Animated.View
            {...panResponder.panHandlers}
            style={{
                position: 'absolute',
                zIndex: 999,
                elevation: 10000,
                transform: [{ translateX: pos.x }, { translateY: pos.y }],
                width: size,
                height: size,
                borderRadius: size / 2,
                overflow: 'hidden',
            }}
        >
            <Pressable
                onPress={() => nav.navigate(CurrencyConvertor)}
                android_ripple={{ color: '#00000022' }}
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#111827',
                }}
            >
                <Text style={{ color: '#fff', fontSize: 22, fontWeight: '700' }}>{label}</Text>
            </Pressable>
        </Animated.View>
    );
}
