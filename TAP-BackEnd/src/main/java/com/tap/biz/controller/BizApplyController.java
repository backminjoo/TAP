package com.tap.biz.controller;

import java.sql.Timestamp;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tap.biz.dto.BizApplyDTO;
import com.tap.biz.dto.CastingData;
import com.tap.biz.dto.CastingDataDTO;
import com.tap.biz.dto.TestClobDTO;
import com.tap.biz.services.BizService;

@RestController
@RequestMapping("/biz/application")
public class BizApplyController {
	@Autowired
	private BizService bizServ;
	
	@GetMapping("/category")
	public ResponseEntity<List<HashMap<String, Object>>> getAllCategory(){
		return ResponseEntity.ok(bizServ.getAllCategory());
	}
	@GetMapping("/subcategory")
	public ResponseEntity<List<HashMap<String, Object>>> getAllSubCategory(){
		return ResponseEntity.ok(bizServ.getAllSubCategory());
	}
	@GetMapping("/location")
	public ResponseEntity<List<HashMap<String, Object>>> getAllLocation(){
		return ResponseEntity.ok(bizServ.getAllLocation());
	}
	@GetMapping("/genre")
	public ResponseEntity<List<HashMap<String, Object>>> getAllGenre(){
		return ResponseEntity.ok(bizServ.getAllGenre());
	}
	@GetMapping("/team")
	public ResponseEntity<List<HashMap<String, Object>>> getAllTeam(){
		return ResponseEntity.ok(bizServ.getAllTeam());
	}
	@GetMapping("/teamlocation")
	public ResponseEntity<List<HashMap<String, Object>>> getAllTeamLocation(){
		return ResponseEntity.ok(bizServ.getAllTeamLocation());
	}
	@GetMapping("/description")
	public ResponseEntity<List<TestClobDTO>> getContent(){
		return ResponseEntity.ok(bizServ.getContent());
	}

	// 상품 테이블에 insert POST
	@PostMapping
	public ResponseEntity<BizApplyDTO> insertEvent(@RequestBody BizApplyDTO formData
			){
		String id = formData.getId();
		Timestamp start_date = formData.getStart_date();
		int running_time = formData.getRunning_time();
		Timestamp open_date = formData.getOpen_date();
		System.out.println("ghkrd");
//		int applicationSeq = bizServ.createApply(formData); // apply테이블에 insert하고 시퀀스 돌려받기. 
//		// applicationSeq로 나머지 데이터 insert하기 
//		System.out.println(applicationSeq);
//
//		List<ScheduleDateDTO> s_list = formData.getScheduleDate();
//		List<TotalScheduleDTO> t_list = formData.getTotalSchedule();
//		for(int i=0; i<t_list.size(); i++) {
//		TotalScheduleDTO t_dto = t_list.get(i);
//		t_dto.setApplication_seq(applicationSeq);
//		bizServ.createApplySchedule(t_dto);
//	}
		
	//CastingData castingData = formData.getCastingData();
	//System.out.println("이름: " +formData.getCastingData().getCastingData().get(0).getCasting_name());

//	List<CastingDataDTO> c_list = castingData.getCastingDataDTO();
//	
//	c_list.forEach(casting ->{
//		CastingDataDTO c_dto = casting;
//		System.out.println(c_dto.getCasting_name());
//	});
	//////////////////////////////////////////////////	


		
		return ResponseEntity.ok(formData);
	}
}
