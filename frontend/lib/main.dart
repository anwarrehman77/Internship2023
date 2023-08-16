import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:multiselect/multiselect.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Better Breakfast',
      theme: ThemeData(
        primarySwatch: Colors.green,
      ),
      home: const LoginPage(),
    );
  }
}

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  // ignore: library_private_types_in_public_api
  _LoginPageState createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final TextEditingController _usernameController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  String _message = '';

  Future<void> _login() async {
    debugPrint("Login Button");
    final response = await http.post(
      Uri.parse('http://localhost:8080/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'username': _usernameController.text,
        'password': _passwordController.text,
      }),
    );

    final data = jsonDecode(response.body);
    setState(() {
      _message = data['message'];
    });

    if (data['success']) {
      // ignore: use_build_context_synchronously
      Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => const Dashboard(
              key: Key("Key"),
            ),
          ));
    }
  }

  Future<void> _register() async {
    debugPrint("Register Button");
    final response = await http.post(
      Uri.parse('http://localhost:8080/register'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'username': _usernameController.text,
        'password': _passwordController.text,
      }),
    );

    final data = jsonDecode(response.body);
    setState(() {
      _message = data['message'];
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Login Page'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            TextField(
              controller: _usernameController,
              decoration: const InputDecoration(labelText: 'Username'),
            ),
            TextField(
              controller: _passwordController,
              decoration: const InputDecoration(labelText: 'Password'),
              obscureText: true,
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: _login,
              child: const Text('Login'),
            ),
            const SizedBox(height: 10),
            ElevatedButton(
              onPressed: _register,
              child: const Text('Register'),
            ),
            const SizedBox(height: 10),
            Text(_message),
          ],
        ),
      ),
    );
  }
}

class Dashboard extends StatefulWidget {
  const Dashboard({super.key});

  @override
  State<Dashboard> createState() => _DashboardState();
}

class _DashboardState extends State<Dashboard> {
  // List<String> fruits = ['Apple', 'Banana', 'Grapes', 'Orange', 'Mango'];
  var fruits = {
    'Eggs': 5,
    'Sandwich': 4,
    'Bagel': 3,
    'Donut': 2,
    'Cereal': 1,
  };

  List<String> selectedFruits = [];
  List<int> selectedScores = [];
  String _message = '';

  Future<void> _sendSelections() async {
    final response = await http.post(
      Uri.parse('http://localhost:8080/savetoday'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'scores': selectedScores,
      }),
    );

    final data = jsonDecode(response.body);
    setState(() {
      _message = data['message'];
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: const Text('Dashboard'),
        ),
        body: Center(
          child: Column(children: <Widget>[
            DropDownMultiSelect(
              options: fruits.keys.toList(),
              selectedValues: selectedFruits,
              onChanged: (value) {
                setState(() {
                  selectedFruits = value;
                  selectedScores = [];
                  for (final fruit in selectedFruits) {
                    selectedScores.add(fruits[fruit]!);
                  }
                });
              },
            ),
            const Padding(padding: EdgeInsets.all(16.0)),
            FloatingActionButton(onPressed: _sendSelections),
            Text(_message),
          ]),
        ));
  }
}
