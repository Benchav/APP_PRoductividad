import React from "react";
import { TextInput } from "react-native-paper";

const InputField = ({ label, value, onChangeText, icon, secureTextEntry }) => {
  return (
    <TextInput
      label={label}
      value={value}
      onChangeText={onChangeText}
      mode="flat"
      secureTextEntry={secureTextEntry}
      style={{ marginBottom: 20, backgroundColor: "#F8FBFF", borderRadius: 10 }}
      left={<TextInput.Icon icon={icon} color="#5DADE2" />}
      theme={{ colors: { primary: "#5DADE2", background: "#fff" } }}
    />
  );
};

export default InputField;