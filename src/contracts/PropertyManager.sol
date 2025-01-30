// src/contracts/PropertyManager.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract PropertyManager is Ownable, ReentrancyGuard, Pausable {
    // Structs
    struct Property {
        address owner;
        uint256 rentAmount;
        uint256 securityDeposit;
        address currentTenant;
        uint256 leaseStart;
        uint256 leaseEnd;
        bool active;
        PropertyStatus status;
    }

    struct MaintenanceRequest {
        uint256 requestId;
        string description;
        uint256 timestamp;
        bool resolved;
        uint256 cost;
    }

    enum PropertyStatus { Available, Rented, Maintenance }

    // State variables
    mapping(uint256 => Property) public properties;
    mapping(uint256 => mapping(uint256 => MaintenanceRequest)) public maintenanceRequests;
    mapping(uint256 => uint256) public maintenanceRequestCount;
    mapping(address => bool) public approvedPaymentTokens;
    
    uint256 public propertyCount;
    
    // Events
    event PropertyListed(uint256 indexed propertyId, address owner, uint256 rentAmount);
    event LeaseInitiated(uint256 indexed propertyId, address indexed tenant);
    event RentPaid(uint256 indexed propertyId, address indexed tenant, uint256 amount);
    event MaintenanceRequested(uint256 indexed propertyId, uint256 requestId);
    event MaintenanceResolved(uint256 indexed propertyId, uint256 requestId);
    
    // Modifiers
    modifier propertyExists(uint256 propertyId) {
        require(properties[propertyId].active, "Property does not exist");
        _;
    }
    
    modifier onlyPropertyOwner(uint256 propertyId) {
        require(properties[propertyId].owner == msg.sender, "Not property owner");
        _;
    }
    
    modifier onlyTenant(uint256 propertyId) {
        require(properties[propertyId].currentTenant == msg.sender, "Not current tenant");
        _;
    }

    constructor() Ownable() {}

        // TEST
    function testConnection() public pure returns (bool) {
        return true;
    }

    function addProperty(
        uint256 _rentAmount,
        uint256 _securityDeposit
    ) external whenNotPaused returns (uint256) {
        propertyCount++;
        
        properties[propertyCount] = Property({
            owner: msg.sender,
            rentAmount: _rentAmount,
            securityDeposit: _securityDeposit,
            currentTenant: address(0),
            leaseStart: 0,
            leaseEnd: 0,
            active: true,
            status: PropertyStatus.Available
        });

        emit PropertyListed(propertyCount, msg.sender, _rentAmount);
        return propertyCount;
    }

    function inititateLease(
        uint256 _propertyId,
        address _tenant,
        uint256 _leaseDuration
    ) external 
        propertyExists(_propertyId)
        onlyPropertyOwner(_propertyId)
        whenNotPaused 
    {
        Property storage property = properties[_propertyId];
        require(property.status == PropertyStatus.Available, "Property not available");
        require(_tenant != address(0), "Invalid tenant address");
        
        property.currentTenant = _tenant;
        property.leaseStart = block.timestamp;
        property.leaseEnd = block.timestamp + _leaseDuration;
        property.status = PropertyStatus.Rented;
        
        emit LeaseInitiated(_propertyId, _tenant);
    }

    function payRent(
        uint256 _propertyId,
        address _paymentToken
    ) external payable
        propertyExists(_propertyId)
        onlyTenant(_propertyId)
        nonReentrant
        whenNotPaused
    {
        Property storage property = properties[_propertyId];
        require(property.status == PropertyStatus.Rented, "Property not rented");
        require(block.timestamp <= property.leaseEnd, "Lease expired");
        
        if (_paymentToken == address(0)) {
            require(msg.value == property.rentAmount, "Incorrect rent amount");
            (bool success, ) = property.owner.call{value: msg.value}("");
            require(success, "Transfer failed");
        } else {
            require(approvedPaymentTokens[_paymentToken], "Token not approved");
            IERC20 token = IERC20(_paymentToken);
            require(
                token.transferFrom(msg.sender, property.owner, property.rentAmount),
                "Token transfer failed"
            );
        }
        
        emit RentPaid(_propertyId, msg.sender, property.rentAmount);
    }

    function requestMaintenance(
        uint256 _propertyId,
        string calldata _description
    ) external
        propertyExists(_propertyId)
        onlyTenant(_propertyId)
        whenNotPaused
    {
        uint256 requestId = maintenanceRequestCount[_propertyId]++;
        
        maintenanceRequests[_propertyId][requestId] = MaintenanceRequest({
            requestId: requestId,
            description: _description,
            timestamp: block.timestamp,
            resolved: false,
            cost: 0
        });
        
        emit MaintenanceRequested(_propertyId, requestId);
    }

    // Admin functions
    function setPaymentToken(address _token, bool _approved) external onlyOwner {
        approvedPaymentTokens[_token] = _approved;
    }
    
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
}

