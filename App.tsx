import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, View } from 'react-native';
import * as SQLite from 'expo-sqlite';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Button title='Perform database operations' onPress={performDBOperations} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const performDBOperations = () => {
  const db = SQLite.openDatabaseSync(":memory:")

  try {
    db.execSync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY NOT NULL, value TEXT NOT NULL, intValue INTEGER unique);  
    `)

    console.log("Insert first entry")
    const stmt1 = db.prepareSync(`INSERT INTO test (value, intValue) VALUES ('test1', 123)`)
    stmt1.executeSync()
    // try { stmt1.executeSync() } finally { stmt1.finalizeSync() }
    // db.runSync(`INSERT INTO test (value, intValue) VALUES ('test1', 123)`)
    
    console.log("Insert second entry")
    const stmt2 = db.prepareSync(`INSERT INTO test (value, intValue) VALUES ('test2', 123)`)
    stmt2.executeSync()
    // try { stmt2.executeSync() } finally { stmt2.finalizeSync() }
    // db.runSync(`INSERT INTO test (value, intValue) VALUES ('test2', 123)`)

    const allRows: any[] = db.getAllSync('SELECT * FROM test');
    for (const row of allRows) {
      console.log(row.id, row.value, row.intValue);
    }
  } catch (e) {
    console.error("Got exception", e)
    throw e
  } finally {
    console.log("Before close")
    db.closeSync() // <-- Exception here
    console.log("After close")
  }
}