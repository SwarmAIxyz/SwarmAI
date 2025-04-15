// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@solana/spl-token";
import "@solana/web3.js";

contract PredictionMarket {
    struct Market {
        bytes32 id;
        address creator;
        uint256 startTime;
        uint256 endTime;
        uint256 totalStake;
        bool resolved;
        mapping(address => Prediction) predictions;
    }

    struct Prediction {
        uint256 value;
        uint256 stake;
        uint256 timestamp;
    }

    mapping(bytes32 => Market) public markets;
    uint256 public minStake;
    uint256 public maxStake;

    event MarketCreated(bytes32 indexed marketId, address creator, uint256 startTime, uint256 endTime);
    event PredictionSubmitted(bytes32 indexed marketId, address predictor, uint256 value, uint256 stake);
    event MarketResolved(bytes32 indexed marketId, uint256 actualValue);
    event RewardClaimed(bytes32 indexed marketId, address predictor, uint256 amount);

    constructor(uint256 _minStake, uint256 _maxStake) {
        minStake = _minStake;
        maxStake = _maxStake;
    }

    function createMarket(bytes32 _id, uint256 _duration) external {
        require(_duration > 0, "Duration must be positive");
        require(markets[_id].creator == address(0), "Market already exists");

        Market storage market = markets[_id];
        market.id = _id;
        market.creator = msg.sender;
        market.startTime = block.timestamp;
        market.endTime = block.timestamp + _duration;
        market.resolved = false;

        emit MarketCreated(_id, msg.sender, market.startTime, market.endTime);
    }

    function submitPrediction(bytes32 _marketId, uint256 _value) external payable {
        Market storage market = markets[_marketId];
        require(market.creator != address(0), "Market does not exist");
        require(!market.resolved, "Market already resolved");
        require(block.timestamp < market.endTime, "Market closed");
        require(msg.value >= minStake && msg.value <= maxStake, "Invalid stake amount");

        market.predictions[msg.sender] = Prediction({
            value: _value,
            stake: msg.value,
            timestamp: block.timestamp
        });
        market.totalStake += msg.value;

        emit PredictionSubmitted(_marketId, msg.sender, _value, msg.value);
    }

    function resolveMarket(bytes32 _marketId, uint256 _actualValue) external {
        Market storage market = markets[_marketId];
        require(market.creator == msg.sender, "Only creator can resolve");
        require(!market.resolved, "Market already resolved");
        require(block.timestamp >= market.endTime, "Market not closed yet");

        market.resolved = true;
        emit MarketResolved(_marketId, _actualValue);
    }

    function claimReward(bytes32 _marketId) external {
        Market storage market = markets[_marketId];
        require(market.resolved, "Market not resolved yet");
        require(market.predictions[msg.sender].stake > 0, "No prediction found");

        // Implement reward calculation and distribution logic here
        // This is a placeholder for the actual implementation
        uint256 reward = calculateReward(_marketId, msg.sender);
        require(reward > 0, "No reward to claim");

        // Transfer reward to predictor
        payable(msg.sender).transfer(reward);

        emit RewardClaimed(_marketId, msg.sender, reward);
    }

    function calculateReward(bytes32 _marketId, address _predictor) internal view returns (uint256) {
        // Implement reward calculation logic here
        // This is a placeholder for the actual implementation
        return 0;
    }
} 