import {
	Button,
	Container,
	Text,
	Title,
	Modal,
	TextInput,
	Group,
	Card,
	ActionIcon,
  } from '@mantine/core';
  import { useState, useRef, useEffect } from 'react';
  import { MoonStars, Sun, Trash } from 'tabler-icons-react';
  
  import {
	MantineProvider,
	ColorSchemeProvider,
  } from '@mantine/core';
  import { useColorScheme } from '@mantine/hooks';
  import { useHotkeys, useLocalStorage } from '@mantine/hooks';
  
  import Web3 from 'web3';
  
  export default function App() {
	const [tasks, setTasks] = useState([]);
	const [opened, setOpened] = useState(false);
  
	const preferredColorScheme = useColorScheme();
	const [colorScheme, setColorScheme] = useLocalStorage({
	  key: 'mantine-color-scheme',
	  defaultValue: 'light',
	  getInitialValueInEffect: true,
	});
	const toggleColorScheme = value =>
	  setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));
  
	useHotkeys([['mod+J', () => toggleColorScheme()]]);
  
	const taskTitle = useRef('');
	const taskSummary = useRef('');
  
	useEffect(() => {
	  async function connectToMetamask() {
		if (window.ethereum) {
		  try {
			await window.ethereum.request({ method: 'eth_requestAccounts' });
			window.web3 = new Web3(window.ethereum);
		  } catch (error) {
			console.error('Error connecting to Metamask:', error);
		  }
		} else {
		  console.error('Metamask not detected');
		}
	  }
  
	  connectToMetamask();
	}, []);
  
	async function createTask() {
	  const contractAddress = '0xcD6a42782d230D7c13A74ddec5dD140e55499Df9'; // Replace with your smart contract address
	  const contractABI = [
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": false,
					"internalType": "string",
					"name": "title",
					"type": "string"
				},
				{
					"indexed": false,
					"internalType": "string",
					"name": "summary",
					"type": "string"
				}
			],
			"name": "TaskCreated",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": false,
					"internalType": "uint256",
					"name": "index",
					"type": "uint256"
				}
			],
			"name": "TaskDeleted",
			"type": "event"
		},
		{
			"inputs": [
				{
					"internalType": "string",
					"name": "_title",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "_summary",
					"type": "string"
				}
			],
			"name": "createTask",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "index",
					"type": "uint256"
				}
			],
			"name": "deleteTask",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [],
			"stateMutability": "nonpayable",
			"type": "constructor"
		},
		{
			"inputs": [],
			"name": "getTaskCount",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "index",
					"type": "uint256"
				}
			],
			"name": "getTaskDetails",
			"outputs": [
				{
					"internalType": "string",
					"name": "title",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "summary",
					"type": "string"
				},
				{
					"internalType": "bool",
					"name": "completed",
					"type": "bool"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "owner",
			"outputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"name": "tasks",
			"outputs": [
				{
					"internalType": "string",
					"name": "title",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "summary",
					"type": "string"
				},
				{
					"internalType": "bool",
					"name": "completed",
					"type": "bool"
				}
			],
			"stateMutability": "view",
			"type": "function"
		}
	]; // Replace with your smart contract ABI
  
	  const contract = new window.web3.eth.Contract(contractABI, contractAddress);
  
	  const accounts = await window.web3.eth.getAccounts();
  
	  const newTask = {
		title: taskTitle.current.value,
		summary: taskSummary.current.value,
	  };
  
	  try {
		await contract.methods.createTask(newTask.title, newTask.summary).send({
		  from: accounts[0],
		});
  
		setTasks([...tasks, newTask]);
		saveTasks([...tasks, newTask]);
	  } catch (error) {
		console.error('Error executing transaction:', error);
	  }
	}
  
	async function deleteTask(index) {
	  const contractAddress = '0xcD6a42782d230D7c13A74ddec5dD140e55499Df9'; // Replace with your smart contract address
	  const contractABI = [
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": false,
					"internalType": "string",
					"name": "title",
					"type": "string"
				},
				{
					"indexed": false,
					"internalType": "string",
					"name": "summary",
					"type": "string"
				}
			],
			"name": "TaskCreated",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": false,
					"internalType": "uint256",
					"name": "index",
					"type": "uint256"
				}
			],
			"name": "TaskDeleted",
			"type": "event"
		},
		{
			"inputs": [
				{
					"internalType": "string",
					"name": "_title",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "_summary",
					"type": "string"
				}
			],
			"name": "createTask",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "index",
					"type": "uint256"
				}
			],
			"name": "deleteTask",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [],
			"stateMutability": "nonpayable",
			"type": "constructor"
		},
		{
			"inputs": [],
			"name": "getTaskCount",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "index",
					"type": "uint256"
				}
			],
			"name": "getTaskDetails",
			"outputs": [
				{
					"internalType": "string",
					"name": "title",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "summary",
					"type": "string"
				},
				{
					"internalType": "bool",
					"name": "completed",
					"type": "bool"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "owner",
			"outputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"name": "tasks",
			"outputs": [
				{
					"internalType": "string",
					"name": "title",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "summary",
					"type": "string"
				},
				{
					"internalType": "bool",
					"name": "completed",
					"type": "bool"
				}
			],
			"stateMutability": "view",
			"type": "function"
		}
	]; // Replace with your smart contract ABI
  
	  const contract = new window.web3.eth.Contract(contractABI, contractAddress);
  
	  const accounts = await window.web3.eth.getAccounts();
  
	  try {
		// Execute the transaction to delete a task
		await contract.methods.deleteTask(index).send({
		  from: accounts[0],
		});
  
		const clonedTasks = [...tasks];
		clonedTasks.splice(index, 1);
  
		setTasks(clonedTasks);
		saveTasks(clonedTasks);
	  } catch (error) {
		console.error('Error executing transaction:', error);
	  }
	}
  
	function loadTasks() {
	  let loadedTasks = localStorage.getItem('tasks');
  
	  let tasks = JSON.parse(loadedTasks);
  
	  if (tasks) {
		setTasks(tasks);
	  }
	}
  
	function saveTasks(tasks) {
	  localStorage.setItem('tasks', JSON.stringify(tasks));
	}
  
	useEffect(() => {
	  loadTasks();
	}, []);
  
	return (
	  <ColorSchemeProvider
		colorScheme={colorScheme}
		toggleColorScheme={toggleColorScheme}>
		<MantineProvider
		  theme={{ colorScheme, defaultRadius: 'md' }}
		  withGlobalStyles
		  withNormalizeCSS>
		  <div className='App'>
			<Modal
			  opened={opened}
			  size={'md'}
			  title={'New Task'}
			  withCloseButton={false}
			  onClose={() => {
				setOpened(false);
			  }}
			  centered>
			  <TextInput
				mt={'md'}
				ref={taskTitle}
				placeholder={'Task Title'}
				required
				label={'Title'}
			  />
			  <TextInput
				ref={taskSummary}
				mt={'md'}
				placeholder={'Task Summary'}
				label={'Summary'}
			  />
			  <Group mt={'md'} position={'apart'}>
				<Button
				  onClick={() => {
					setOpened(false);
				  }}
				  variant={'subtle'}>
				  Cancel
				</Button>
				<Button
				  onClick={() => {
					createTask();
					setOpened(false);
				  }}>
				  Create Task
				</Button>
			  </Group>
			</Modal>
			<Container size={550} my={40}>
			  <Group position={'apart'}>
				<Title
				  sx={theme => ({
					fontFamily: `Greycliff CF, ${theme.fontFamily}`,
					fontWeight: 900,
				  })}>
				  My Tasks
				</Title>
				{/* ... (rest of the code remains unchanged) */}
			  </Group>
			  {tasks.length > 0 ? (
				tasks.map((task, index) => (
				  <Card key={index} withBorder mt={'sm'}>
					<Group position={'apart'}>
					  <Text weight={'bold'}>{task.title}</Text>
					  <ActionIcon
						onClick={() => {
						  deleteTask(index);
						}}
						color={'red'}
						variant={'transparent'}>
						<Trash />
					  </ActionIcon>
					</Group>
					<Text color={'dimmed'} size={'md'} mt={'sm'}>
					  {task.summary
						? task.summary
						: 'No summary was provided for this task'}
					</Text>
				  </Card>
				))
			  ) : (
				<Text size={'lg'} mt={'md'} color={'dimmed'}>
				  You have no tasks
				</Text>
			  )}
			  <Button
				onClick={() => {
				  setOpened(true);
				}}
				fullWidth
				mt={'md'}>
				New Task
			  </Button>
			</Container>
		  </div>
		</MantineProvider>
	  </ColorSchemeProvider>
	);
  }
  