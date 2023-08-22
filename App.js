import React from "react";
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { Button } from "@react-native-material/core";
import {
  Provider,
  Dialog,
  DialogHeader,
  DialogContent,
  DialogActions,
} from "@react-native-material/core";
import api from "./assets/DataRes.json";
import initSelected from "./assets/selectedData.json";

const flatten = (obj) => {
  const flat = {};
  for (let [key, value] of Object.entries(obj.body.lovFieldValues)) {
    value.forEach((v) => {
      if (!flat[key]) flat[key] = {};
      flat[key][v.value] = v.description;
    })
    
  }
  return flat;
}

const flatApi = flatten(api);

const ItemLabel = ({ selection }) => (
  <>
    <Text style={styles.title}>{camelCaseToWords(selection.key)}: </Text>
    <Text style={styles.value}>{flatApi[selection.key][selection.value]}</Text>
  </>
)

const Item = ({ selection, edit }) => (
  flatApi[selection.key]?
    <Button title={<ItemLabel selection={selection} />}
      style={styles.item} uppercase={false}
      onPress={() => edit(selection.key)} />
  : null
);

const OptionItem = ({ item, option, edit, updateSelected }) => (
  <Button title={<Text style={styles.title}>{item.description}</Text>}
    style={styles.item} uppercase={false}
    onPress={() => { updateSelected(item.value); console.log('api update: ', option, item.value); edit(''); } } />
);


const OptionList = ({ option, edit, updateSelected }) => (
  <FlatList
    data={api.body.lovFieldValues[option]}
    renderItem={({ item }) => <OptionItem item={item} option={option} edit={edit} updateSelected={updateSelected} />}
    keyExtractor={item => item.value}
  />
)


export default function App() {
  const [selected, setSelected] = React.useState(initSelected.body);
  const [editOption, setEditOption] = React.useState('');
  const updateSelected = (selection) => {
    setSelected({ ...selected, [editOption]: selection });
  };

  return (
    <Provider>
    <View >
      <FlatList
        data={selectArr(selected)}
        renderItem={({item}) => <Item selection={item} edit={setEditOption} />}
        keyExtractor={item => item.key}
      />
      <Dialog visible={editOption!==''} onDismiss={() => setEditOption('')}>
        <DialogHeader title={`Edit: ${camelCaseToWords(editOption)}`} />

        <DialogContent>
          <OptionList option={editOption} edit={setEditOption} updateSelected={updateSelected} />
        </DialogContent>
        <DialogActions>
          <Button
            title="Cancel"
            compact
            variant="text"
            onPress={() => setEditOption('')}
          />
        </DialogActions>
      </Dialog>
      </View>
      </Provider>
  );
};

const selectArr = (obj) => {
  const arr = [];
  for (let [key, value] of Object.entries(obj)) {
    arr.push({key, value});
  }
  return arr;
}

const camelCaseToWords = (s) => {
  const result = s.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#ddd',
    padding: 10,
    marginVertical: 4,
    marginHorizontal: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  value: {

  }
});
