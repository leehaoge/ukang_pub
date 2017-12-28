package com.urion;

import android.os.Parcel;
import android.os.Parcelable;

/**
 * Created by Lanny Lee on 2017/12/19.
 */

public class Beans {

    public static class Head implements Parcelable {

        /**
         * 测量结果
         */
        public final static int TYPE_RESULT = 0xFC;
        /**
         * 错误信息
         */
        public final static int TYPE_ERROR = 0xFD;
        /**
         * 测量开始
         */
        public final static int TYPE_MESSAGE = 0x06;
        /**
         * 压力数据 测量过程信息
         */
        public final static int TYPE_PRESSURE = 0xFB;

        private int head1;

        private int head2;

        private int type;

        public Head() {

        }

        public int getHead1() {
            return head1;
        }

        public void setHead1(int head1) {
            this.head1 = head1;
        }

        public int getHead2() {
            return head2;
        }

        public void setHead2(int head2) {
            this.head2 = head2;
        }

        public int getType() {
            return type;
        }

        public void setType(int type) {
            this.type = type;
        }

        public void analysis(int[] i) {
            head1 = i[0];
            head2 = i[1];
            type = i[2];
            System.out.println("head1:" + head1 + " head2:" + head2 + " type:"
                    + type);
        }

        public int describeContents() {
            return 0;
        }

        public void writeToParcel(Parcel dest, int flags) {
            dest.writeFloat(head1);
            dest.writeFloat(head2);
            dest.writeFloat(type);
        }

        public static final Parcelable.Creator<Head> CREATOR = new Parcelable.Creator<Head>() {
            public Head createFromParcel(Parcel in) {
                return new Head(in);
            }

            public Head[] newArray(int size) {
                return new Head[size];
            }
        };

        private Head(Parcel in) {
            head1 = in.readInt();
            head2 = in.readInt();
            type = in.readInt();
        }
    }

    public static abstract class IBean implements Parcelable {
        public final static int DATA = 0;
        public final static int MESSAGE = 1;
        public final static int ERROR = 2;
        public final static int PRESSURE = 3;
        public Head head;

        public IBean() {
            head = null;
        }

        public Head getHead() {
            return head;
        }

        public void setHead(Head head) {
            this.head = head;
        }

        public abstract void analysis(int[] i);
    }


    public static class Data extends IBean {

        private String value;
        private int time;
        /**
         * 收缩压
         */
        private int sys;
        /**
         * 舒张压
         */
        private int dia;
        /**
         * 心率
         */
        private int pul;

        public Data() {
            super();
        }

        public Data(String value) {
            super();
            this.value = value;
        }

        public Data(String value, int time, int sys, int dia, int pul) {
            super();
            this.value = value;
            this.time = time;
            this.sys = sys;
            this.dia = dia;
            this.pul = pul;
        }

        public String getValue() {
            return value;
        }

        public void setValue(String value) {
            this.value = value;
        }

        public int getTime() {
            return time;
        }

        public void setTime(int time) {
            this.time = time;
        }

        public int getSys() {
            return sys;
        }

        public void setSys(int sys) {
            this.sys = sys;
        }

        public int getDia() {
            return dia;
        }

        public void setDia(int dia) {
            this.dia = dia;
        }

        public int getPul() {
            return pul;
        }

        public void setPul(int pul) {
            this.pul = pul;
        }

        public void analysis(int[] f) {
            sys = f[3];
            dia = f[4];
            pul = f[5];
            System.out.println("SYS:" + sys + " DIA:" + dia + " PUL:" + pul);
        }

        public int describeContents() {
            return 0;
        }

        public void writeToParcel(Parcel dest, int flags) {
            dest.writeString(value);
            dest.writeInt(time);
            dest.writeInt(sys);
            dest.writeInt(dia);
            dest.writeInt(pul);
        }

        public static final Parcelable.Creator<Data> CREATOR = new Parcelable.Creator<Data>() {
            public Data createFromParcel(Parcel in) {
                return new Data(in);
            }

            public Data[] newArray(int size) {
                return new Data[size];
            }
        };

        private Data(Parcel in) {
            value = in.readString();
            time = in.readInt();
            sys = in.readInt();
            dia = in.readInt();
            pul = in.readInt();
        }
    }

    public static class Error extends IBean {

        /**
         * 连接失败
         */
        public static final int ERROR_CONNECTION_FAILED = 0;
        /**
         * 连接丢失
         */
        public static final int ERROR_CONNECTION_LOST = 1;

        // 血压仪错误信息常量
        /**
         * E-E EEPROM异常
         */
        public static final int ERROR_EEPROM = 0x0E;
        /**
         * E-1 人体心跳信号太小或压力突降
         */
        public static final int ERROR_HEART = 0x01;
        /**
         * E-2 杂讯干扰
         */
        public static final int ERROR_DISTURB = 0x02;
        /**
         * E-3 充气时间过长
         */
        public static final int ERROR_GASING = 0x03;
        /**
         * E-4 测得的结果异常
         */
        public static final int ERROR_TEST = 0x05;
        /**
         * E-C 校正异常
         */
        public static final int ERROR_REVISE = 0x0C;
        /**
         * E-B 电源低电压
         */
        public static final int ERROR_POWER = 0x0B;

        /**
         * 错误代码，该错误代码分为连接时的错误(int类型)和连接后血压仪发送的错误(float类型)
         */
        private int error_code;

        private int error;

        public Error() {
            super();
        }

        public Error(int errorCode) {
            super();
            error_code = errorCode;
        }

        public int getError_code() {
            return error_code;
        }

        public void setError_code(int errorCode) {
            error_code = errorCode;
        }

        public int getError() {
            return error;
        }

        public void setError(int error) {
            this.error = error;
        }

        public int describeContents() {
            return 0;
        }

        public void writeToParcel(Parcel dest, int flags) {
            dest.writeInt(error_code);
            dest.writeInt(error);
        }

        public static final Parcelable.Creator<Error> CREATOR = new Parcelable.Creator<Error>() {
            public Error createFromParcel(Parcel in) {
                return new Error(in);
            }

            public Error[] newArray(int size) {
                return new Error[size];
            }
        };

        private Error(Parcel in) {
            error_code = in.readInt();
            error = in.readInt();
        }

        public void analysis(int[] f) {
            error = f[3];

        }
    }

    public static class Msg extends IBean {

        public static final int MESSAGE_STATE_CONNECTING = 0;
        public static final int MESSAGE_STATE_NONE = 1;
        public static final int MESSAGE_STATE_CONNECTED = 2;

        public static final int START = 0x06;

        private int msg_code;
        private String device_name;

        public Msg() {
            super();
        }

        public Msg(int msgCode, String deviceName) {
            super();
            msg_code = msgCode;
            device_name = deviceName;
        }

        public int getMsg_code() {
            return msg_code;
        }

        public void setMsg_code(int msgCode) {
            msg_code = msgCode;
        }

        public String getDevice_name() {
            return device_name;
        }

        public void setDevice_name(String deviceName) {
            device_name = deviceName;
        }

        public int describeContents() {
            return 0;
        }

        public void writeToParcel(Parcel dest, int flags) {
            dest.writeInt(msg_code);
            dest.writeString(device_name);
        }

        public static final Parcelable.Creator<Msg> CREATOR = new Parcelable.Creator<Msg>() {
            public Msg createFromParcel(Parcel in) {
                return new Msg(in);
            }

            public Msg[] newArray(int size) {
                return new Msg[size];
            }
        };

        private Msg(Parcel in) {
            msg_code = in.readInt();
            device_name = in.readString();
        }

        public void analysis(int[] i) {
            msg_code = i[2];
        }
    }

    public static class Pressure extends IBean {

        private int PressureH;
        private int PressureL;

        public Pressure() {
            super();
        }

        public int getPressure() {
            return PressureH * 256 + PressureL;
        }

        public int getPressureHL() {
            return PressureH + PressureL;
        }

        public int getPressureH() {
            return PressureH;
        }

        public void setPressureH(int pressureH) {
            PressureH = pressureH;
        }

        public int getPressureL() {
            return PressureL;
        }

        public void setPressureL(int pressureL) {
            PressureL = pressureL;
        }

        public void analysis(int[] f) {
            PressureH = f[3];
            PressureL = f[4];
            System.out
                    .println("PressureH:" + PressureH + " PressureL:" + PressureL);
        }

        public int describeContents() {
            return 0;
        }

        public void writeToParcel(Parcel dest, int flags) {
            dest.writeFloat(PressureH);
            dest.writeFloat(PressureL);
        }

        public static final Parcelable.Creator<Pressure> CREATOR = new Parcelable.Creator<Pressure>() {
            public Pressure createFromParcel(Parcel in) {
                return new Pressure(in);
            }

            public Pressure[] newArray(int size) {
                return new Pressure[size];
            }
        };

        private Pressure(Parcel in) {
            PressureH = in.readInt();
            PressureL = in.readInt();
        }
    }
}
