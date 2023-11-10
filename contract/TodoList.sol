// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TodoList {
    struct Task {
        string title;
        string summary;
        bool completed;
    }

    Task[] public tasks;
    address public owner;

    event TaskCreated(string title, string summary);
    event TaskDeleted(uint256 index);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function createTask(string memory _title, string memory _summary) external onlyOwner {
        Task memory newTask = Task({
            title: _title,
            summary: _summary,
            completed: false
        });

        tasks.push(newTask);
        emit TaskCreated(_title, _summary);
    }

    function getTaskCount() external view returns (uint256) {
        return tasks.length;
    }

    function getTaskDetails(uint256 index) external view returns (string memory title, string memory summary, bool completed) {
        require(index < tasks.length, "Task index out of bounds");
        return (tasks[index].title, tasks[index].summary, tasks[index].completed);
    }

    function deleteTask(uint256 index) external onlyOwner {
        require(index < tasks.length, "Task index out of bounds");

        // Emit event before deletion
        emit TaskDeleted(index);

        // Delete the task
        for (uint256 i = index; i < tasks.length - 1; i++) {
            tasks[i] = tasks[i + 1];
        }
        tasks.pop();
    }
}
