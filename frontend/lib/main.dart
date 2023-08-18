import 'package:flutter/services.dart';
import 'package:intl/intl.dart';
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
    String username = _usernameController.text;
    String password = _passwordController.text;
    final response = await http.post(
      Uri.parse('http://localhost:8080/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'username': username,
        'password': password,
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
            builder: (context) => Dashboard(
              name: username,
              key: const Key("Key"),
            ),
          ));
    }
  }

  Future<void> _register() async {
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
              decoration: const InputDecoration(hintText: 'Username'),
            ),
            TextField(
              controller: _passwordController,
              decoration: const InputDecoration(hintText: 'Password'),
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
  final String name;
  const Dashboard({required this.name, super.key});

  @override
  State<Dashboard> createState() => _DashboardState();
}

class _DashboardState extends State<Dashboard> {
  var fruits = {
    'Eggs': 5,
    'Sandwich': 4,
    'Bagel': 3,
    'Donut': 2,
    'Cereal': 1,
  };
  final TextEditingController _optionNameController = TextEditingController();
  final TextEditingController _optionScoreController = TextEditingController();
  List<String> selectedFruits = [];
  List<int> selectedScores = [];
  List<String> breakfastOptions = [];
  String _message = '';
  String _newOptionMessage = '';
  String _scoreMessage = '';
  double score = 0;

  Future<void> _sendSelections() async {
    DateTime today = DateTime.now();

    final formattedDate = DateFormat('yyyy-MM-dd').format(today);

    final response = await http.post(
      Uri.parse('http://localhost:8080/savetohist'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'username': widget.name,
        'scores': selectedScores,
        'date': formattedDate,
      }),
    );

    final data = jsonDecode(response.body);
    setState(() {
      _message = data['message'];
    });
  }

  Future<void> _getAverageScore() async {
    final response = await http.post(
      Uri.parse('http://localhost:8080/getaveragescore'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'username': widget.name,
      }),
    );

    final data = jsonDecode(response.body);
    setState(() {
      _scoreMessage = data['message'];
    });
  }

  Future<void> _sendOption() async {
    final response = await http.post(
      Uri.parse('http://localhost:8080/saveoptions'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'name': _optionNameController.text,
        'user': widget.name,
        'score': int.parse(_optionScoreController.text),
      }),
    );

    final data = jsonDecode(response.body);

    setState(() {
      _newOptionMessage = data['message'];
    });
  }

  Future<void> _getOptions() async {
    final response = await http.post(
      Uri.parse('http://localhost:8080/getoptions'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'name': widget.name,
      }),
    );

    final data = jsonDecode(response.body);

    if (data['success']) {
      setState(() {
        breakfastOptions = List<String>.from(data['options']);
      });
      breakfastOptions.forEach((element) {
        debugPrint(element);
      });
    } else {}
    debugPrint(data['message']);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: const Text('Dashboard'),
        ),
        body: Center(
          child: Column(children: <Widget>[
            Text('Hello ${widget.name}!'),
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
            ElevatedButton(
                onPressed: _sendSelections,
                child: const Text('Save your selections (ONCE A DAY)')),
            const SizedBox(height: 10),
            Text(_message),
            const SizedBox(height: 10),
            ElevatedButton(
              onPressed: _getAverageScore,
              child: const Text('See your updated score!'),
            ),
            Text(_scoreMessage),
            TextField(
              controller: _optionNameController,
              decoration: const InputDecoration(
                  hintText: 'Enter the name of your new Breakfast Option'),
            ),
            TextFormField(
                controller: _optionScoreController,
                keyboardType: TextInputType.number,
                inputFormatters: <TextInputFormatter>[
                  FilteringTextInputFormatter.digitsOnly
                ],
                decoration: const InputDecoration(
                  hintText: "Enter its healthiness score (1-5)",
                )),
            ElevatedButton(
                onPressed: _sendOption,
                child: const Text('Submit your new breakfast option!')),
            Text(_newOptionMessage),
            ElevatedButton(
                onPressed: _getOptions, child: const Text('get options'))
          ]),
        ));
  }
}
