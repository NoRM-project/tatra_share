package sk.norm.tatrashare.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import sk.norm.tatrashare.auth.CurrentUserProvider;
import sk.norm.tatrashare.dto.GroupReportDto;
import sk.norm.tatrashare.service.ReportService;

@RestController
@RequestMapping("/api/groups/{groupId}/report")
@RequiredArgsConstructor
public class ReportController {

	private final ReportService reportService;
	private final CurrentUserProvider currentUserProvider;

	@GetMapping
	public GroupReportDto getReport(@PathVariable Long groupId) {
		Long currentUserId = currentUserProvider.getCurrentUserId();
		return reportService.getGroupReport(groupId, currentUserId);
	}
}
