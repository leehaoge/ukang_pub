package com.lec.u_kang;

/**
 * Created by lhy_uk on 2018/1/10.
 */

public class Dummy {

    public static void main(String[] args) {
        String send_data = "CE02C5157C0000";
        float weight = Integer.decode("0x"+ send_data.substring(2,6)) / 10.0f;
        float radiation = Integer.decode("0x"+ send_data.substring(6,10)) / 10.0f;

        System.out.println("weight:" + weight + ",radiation:" + radiation );
    }
}
