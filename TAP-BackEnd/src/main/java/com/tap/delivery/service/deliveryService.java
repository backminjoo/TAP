package com.tap.delivery.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tap.delivery.dao.deliveryDAO;
import com.tap.delivery.dto.DeliveryDTO;

@Service
public class deliveryService {
	
	@Autowired
	private deliveryDAO dao;
	
	public int insert(DeliveryDTO dto) throws Exception{
		return dao.insert(dto);
	}

}
