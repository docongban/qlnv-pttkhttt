package com.laos.edu.commons;

import com.laos.edu.config.Constants;
import com.laos.edu.service.dto.*;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.lang.reflect.Field;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;

import com.laos.edu.service.dto.ExcelColumn;
import org.apache.commons.lang3.math.NumberUtils;
import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.streaming.SXSSFSheet;
import org.apache.poi.xssf.usermodel.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class ExportUtils {

    private final static DecimalFormat doubleFormat = new DecimalFormat("#.##");
    private final static DecimalFormat doubleFormat1 = new DecimalFormat("###,###");
    private final static DecimalFormat moneyFormat = new DecimalFormat("###,###.##");
    private final Logger log = LoggerFactory.getLogger(ExportUtils.class);

    public ByteArrayInputStream onExport(
        List<ExcelColumn> lstColumn,
        List<?> lstData,
        int startRow,
        int startCol,
        ExcelTitle excelTitle,
        Boolean displayIndex,
        String sheetName
    ) throws Exception {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet(sheetName);
            int diff = this.getDiff(displayIndex);

            Row rowHeader = createFileTitle(startRow, startCol, excelTitle, workbook, sheet, (short) 500, (lstColumn.size() - 1 + diff));

            CellStyle cellStyleHeader = createStyleHeader(workbook);

            if (Boolean.TRUE.equals(displayIndex)) {
                Cell cellIndex = rowHeader.createCell(startCol);
                cellIndex.setCellValue("STT");
                cellIndex.setCellStyle(cellStyleHeader);
            }
            for (int i = 0; i < lstColumn.size(); i++) {
                Cell cellHeader = rowHeader.createCell(i + startCol + diff);
                cellHeader.setCellValue(lstColumn.get(i).getTitle());
                cellHeader.setCellStyle(cellStyleHeader);
            }
            AtomicInteger atomicInteger = new AtomicInteger(0);
            lstColumn.forEach(
                e -> {
                    if (e.getColumnWidth() != null) {
                        sheet.setColumnWidth(startCol + diff + atomicInteger.getAndIncrement(), e.getColumnWidth());
                    }
                }
            );

            //trai
            ByteArrayInputStream byteArrayInputStream = createFileOutput(
                lstColumn,
                lstData,
                startRow,
                startCol,
                workbook,
                sheet,
                displayIndex
            );
            return byteArrayInputStream;
        }
    }

    public ByteArrayInputStream onExport(
        List<ExcelColumn> lstColumn,
        List<?> lstData,
        int startRow,
        int startCol,
        ExcelTitle excelTitle,
        Boolean displayIndex
    ) throws Exception {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("sheet 1");
            int diff = this.getDiff(displayIndex);

            Row rowHeader = createFileTitle(startRow, startCol, excelTitle, workbook, sheet, (short) 500, (lstColumn.size() - 1 + diff));

            CellStyle cellStyleHeader = createStyleHeader(workbook);

            if (Boolean.TRUE.equals(displayIndex)) {
                Cell cellIndex = rowHeader.createCell(startCol);
                cellIndex.setCellValue(Translator.toLocale("school.export.no"));
                cellIndex.setCellStyle(cellStyleHeader);
            }
            for (int i = 0; i < lstColumn.size(); i++) {
                Cell cellHeader = rowHeader.createCell(i + startCol + diff);
                cellHeader.setCellValue(lstColumn.get(i).getTitle());
                cellHeader.setCellStyle(cellStyleHeader);
            }
            AtomicInteger atomicInteger = new AtomicInteger(0);
            lstColumn.forEach(
                e -> {
                    if (e.getColumnWidth() != null) {
                        sheet.setColumnWidth(startCol + diff + atomicInteger.getAndIncrement(), e.getColumnWidth());
                    }
                }
            );

            //trai
            ByteArrayInputStream byteArrayInputStream = createFileOutput(
                lstColumn,
                lstData,
                startRow,
                startCol,
                workbook,
                sheet,
                displayIndex
            );
            return byteArrayInputStream;
        }
    }

    private List<ExcelColumn> lstColumnUser(){
        List<ExcelColumn> lstColumn = new ArrayList<>();
        lstColumn.add(new ExcelColumn("countBeginRegister", Translator.toLocale("rp.register"), ExcelColumn.ALIGN_MENT.CENTER));
        lstColumn.add(new ExcelColumn("countBeginCancel", Translator.toLocale("rp.cancel"), ExcelColumn.ALIGN_MENT.CENTER));
        lstColumn.add(new ExcelColumn("countCurrentRegister", Translator.toLocale("rp.register"), ExcelColumn.ALIGN_MENT.CENTER));
        lstColumn.add(new ExcelColumn("countCurrentCancel", Translator.toLocale("rp.cancel"), ExcelColumn.ALIGN_MENT.CENTER));
        lstColumn.add(new ExcelColumn("countActiveEnd", Translator.toLocale("rp.active.end"), ExcelColumn.ALIGN_MENT.CENTER,2000));
        lstColumn.add(new ExcelColumn("ratioGrowthUser", Translator.toLocale("rp.user"), ExcelColumn.ALIGN_MENT.CENTER,2000));
        return lstColumn;
    }

    private List<ExcelColumn> lstColumnPrice(){
        List<ExcelColumn> lstColumn = new ArrayList<>();
        lstColumn.add(new ExcelColumn("sumBeginPrice", Translator.toLocale("rp.price.begin"), ExcelColumn.ALIGN_MENT.CENTER));
        lstColumn.add(new ExcelColumn("sumBeginPrice", Translator.toLocale("rp.price.begin"), ExcelColumn.ALIGN_MENT.CENTER));
        lstColumn.add(new ExcelColumn("sumCurrentPrice", Translator.toLocale("rp.price.current"), ExcelColumn.ALIGN_MENT.CENTER));
        lstColumn.add(new ExcelColumn("sumCurrentPrice", Translator.toLocale("rp.price.current"), ExcelColumn.ALIGN_MENT.CENTER));
        lstColumn.add(new ExcelColumn("sumPriceEnd", Translator.toLocale("rp.price.end"), ExcelColumn.ALIGN_MENT.CENTER));
        lstColumn.add(new ExcelColumn("ratioGrowthPrice", Translator.toLocale("rp.price"), ExcelColumn.ALIGN_MENT.CENTER));
        return lstColumn;
    }
    public ByteArrayInputStream onExportReportPrice(
            List<ExcelColumn> lstColumn,
            RegisterReportDTO lstData,
            int startRow,
            int startCol,
            ExcelTitle excelTitle,
            Boolean displayIndex
    ) throws Exception {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Data");
            int diff = this.getDiff(displayIndex);
            int size = 17;
            final XSSFSheet xssfsheet = (XSSFSheet) sheet;
            xssfsheet.addIgnoredErrors(new CellRangeAddress(0, 99, 0, 99), IgnoredErrorType.NUMBER_STORED_AS_TEXT);
            Row rowHeader = createFileTitleReportPrice(
                    startRow,
                    startCol,
                    excelTitle,
                    workbook,
                    sheet,
                    (short) 500,
                    (lstColumn.size() - 1 + diff)
            );
            CellStyle cellStyleHeader = createStyleHeader(workbook);
            Row rowMerge = sheet.createRow(size);
            Row rowMergeUser = sheet.createRow(6);
            Row rowMergeUser0 = sheet.createRow(5);
            Row rowDataUser = sheet.createRow(7);

            Row rowPrice = sheet.createRow(12);
            Row rowDataPrice = sheet.createRow(13);

            Row titleCountReportPrice1 = sheet.createRow(2);
            Row titleCountReportPrice11 = sheet.createRow(3);
            Row titleCountReportPrice12 = sheet.createRow(10);
            Row titleCountReportPrice2 = sheet.createRow(15);

            List<ExcelColumn> lstColumnUser = lstColumnUser();
            List<ExcelColumn> lstColumnPrice = lstColumnPrice();
            CellStyle cellStyleCenter = getCellStyle(workbook, HorizontalAlignment.CENTER);
            if (Boolean.TRUE.equals(displayIndex)) {
                for (int i = 0; i < lstColumnUser.size(); i++) {
                    Cell cellHeader = rowMergeUser0.createCell(i + 1 + diff);
                    cellHeader.setCellValue(lstColumnUser.get(i).getTitle());
                    cellHeader.setCellStyle(cellStyleHeader);
                }
                for (int i = 0; i < lstColumnUser.size(); i++) {
                    Cell cellHeader = rowMergeUser.createCell(i + 1 + diff);
                    cellHeader.setCellValue(lstColumnUser.get(i).getTitle());
                    cellHeader.setCellStyle(cellStyleHeader);
                }

                Cell cell = rowMergeUser0.createCell(2);
                cell.setCellValue(Translator.toLocale("rp.count.begin"));
                cell.setCellStyle(cellStyleHeader);
                sheet.addMergedRegionUnsafe(new CellRangeAddress(5, 5, 2, 3));
                Cell cellMerge1 = rowMergeUser0.createCell(4);
                cellMerge1.setCellValue(Translator.toLocale("rp.current"));
                cellMerge1.setCellStyle(cellStyleHeader);
                sheet.addMergedRegionUnsafe(new CellRangeAddress(5, 5, 4, 5));
                sheet.addMergedRegion(new CellRangeAddress(5, 6, 6, 6));
                sheet.addMergedRegion(new CellRangeAddress(5, 6, 7, 7));
                Cell cellDataUser1 = rowDataUser.createCell(2);
                cellDataUser1.setCellValue(moneyFormat.format(lstData.getDataStatistical().getCountBeginRegister()));
                cellDataUser1.setCellStyle(cellStyleCenter);
                Cell cellDataUser2 = rowDataUser.createCell(3);
                cellDataUser2.setCellValue(moneyFormat.format(lstData.getDataStatistical().getCountBeginCancel()));
                cellDataUser2.setCellStyle(cellStyleCenter);
                Cell cellDataUser3 = rowDataUser.createCell(4);
                cellDataUser3.setCellValue(moneyFormat.format(lstData.getDataStatistical().getCountCurrentRegister()));
                cellDataUser3.setCellStyle(cellStyleCenter);
                Cell cellDataUser4 = rowDataUser.createCell(5);
                cellDataUser4.setCellValue(moneyFormat.format(lstData.getDataStatistical().getCountCurrentCancel()));
                cellDataUser4.setCellStyle(cellStyleCenter);
                Cell cellDataUser5 = rowDataUser.createCell(6);
                cellDataUser5.setCellValue(moneyFormat.format(lstData.getDataStatistical().getCountActiveEnd()));
                cellDataUser5.setCellStyle(cellStyleCenter);
                Cell cellDataUser6 = rowDataUser.createCell(7);
                cellDataUser6.setCellValue(lstData.getDataStatistical().getRatioGrowthUser());
                if (NumberUtils.isCreatable(lstData.getDataStatistical().getRatioGrowthUser())) {
                    cellDataUser6.setCellValue(moneyFormat.format(Double.parseDouble(lstData.getDataStatistical().getRatioGrowthUser()))+"%");
                }
                cellDataUser6.setCellStyle(cellStyleCenter);

                for (int i = 0; i < lstColumnPrice.size(); i++) {
                    Cell cellHeader = rowPrice.createCell(i + 1 + diff);
                    cellHeader.setCellValue(lstColumnPrice.get(i).getTitle());
                    cellHeader.setCellStyle(cellStyleHeader);

                    if (i == 0 || i == 1) {
                        sheet.addMergedRegion(new CellRangeAddress(12, 12, 2 + (i * 2), 3 + (i * 2)));
                        sheet.addMergedRegion(new CellRangeAddress(13, 13, 2 + (i * 2), 3 + (i * 2)));
                    }
                }
                Cell cellDataPrice1 = rowDataPrice.createCell(2);
                Cell cellDataPrice11 = rowDataPrice.createCell(3);
                cellDataPrice1.setCellValue(moneyFormat.format(lstData.getDataStatistical().getSumBeginPrice()));
                cellDataPrice1.setCellStyle(cellStyleCenter);
                cellDataPrice11.setCellStyle(cellStyleCenter);

                Cell cellDataPrice2 = rowDataPrice.createCell(4);
                Cell cellDataPrice21 = rowDataPrice.createCell(5);
                cellDataPrice2.setCellValue(moneyFormat.format(lstData.getDataStatistical().getSumCurrentPrice()));
                cellDataPrice2.setCellStyle(cellStyleCenter);
                cellDataPrice21.setCellStyle(cellStyleCenter);

                Cell cellDataPrice3 = rowDataPrice.createCell(6);
                cellDataPrice3.setCellValue(moneyFormat.format(lstData.getDataStatistical().getSumPriceEnd()));
                cellDataPrice3.setCellStyle(cellStyleCenter);

                Cell cellDataPrice4 = rowDataPrice.createCell(7);
                cellDataPrice4.setCellValue(lstData.getDataStatistical().getRatioGrowthPrice());
                if (NumberUtils.isCreatable(lstData.getDataStatistical().getRatioGrowthPrice())) {
                    cellDataPrice4.setCellValue(moneyFormat.format(Double.parseDouble(lstData.getDataStatistical().getRatioGrowthPrice()))+"%");
                }
                cellDataPrice4.setCellStyle(cellStyleCenter);

                Cell cellIndex = rowMerge.createCell(startCol);
                cellIndex.setCellValue(Translator.toLocale("rp.no"));
                cellIndex.setCellStyle(cellStyleHeader);

                CellStyle cellStyle =workbook.createCellStyle();
                Font hSSFFontHeader = createFontHeader(workbook);
                cellStyle.setFont(hSSFFontHeader);
                Cell celltitleCountReportPrice1 = titleCountReportPrice1.createCell(0);
                celltitleCountReportPrice1.setCellValue(Translator.toLocale("rp.title.report.count"));
                celltitleCountReportPrice1.setCellStyle(cellStyle);
                Cell celltitleCountReportPrice11 = titleCountReportPrice11.createCell(0);
                celltitleCountReportPrice11.setCellValue(Translator.toLocale("rp.title.report.count.user"));

                Cell celltitleCountReportPrice12 = titleCountReportPrice12.createCell(0);
                celltitleCountReportPrice12.setCellValue(Translator.toLocale("rp.title.report.count.price"));

                Cell celltitleCountReportPrice2 = titleCountReportPrice2.createCell(0);
                celltitleCountReportPrice2.setCellValue(Translator.toLocale("rp.title.report.desc"));
                celltitleCountReportPrice2.setCellStyle(cellStyle);
            }
            for (int i = 0; i < lstColumn.size(); i++) {
                    Cell cellHeader = rowMerge.createCell(i + startCol + diff);
                    cellHeader.setCellValue(lstColumn.get(i).getTitle());
                    cellHeader.setCellStyle(cellStyleHeader);
            }
            for (int i = 0; i < lstColumn.size(); i++) {
                Cell cellHeader = rowHeader.createCell(i + startCol + diff);
                cellHeader.setCellValue(lstColumn.get(i).getTitle());
                cellHeader.setCellStyle(cellStyleHeader);
            }

            Cell cell = rowMerge.createCell(2);
            cell.setCellValue(Translator.toLocale("rp.count.begin"));
            cell.setCellStyle(cellStyleHeader);
            sheet.addMergedRegionUnsafe(new CellRangeAddress(size, size, 2, 3));
            Cell cellMerge1 = rowMerge.createCell(5);
            cellMerge1.setCellValue(Translator.toLocale("rp.current"));
            cellMerge1.setCellStyle(cellStyleHeader);
            sheet.addMergedRegionUnsafe(new CellRangeAddress(size, size, 5, 6));
            Cell cellMerge2 = rowMerge.createCell(8);
            cellMerge2.setCellValue(Translator.toLocale("rp.count.end"));
            cellMerge2.setCellStyle(cellStyleHeader);
            sheet.addMergedRegionUnsafe(new CellRangeAddress(size, size, 8, 9));
            sheet.addMergedRegion(new CellRangeAddress(size, size+1, 0, 0));
            sheet.addMergedRegion(new CellRangeAddress(size, size+1, 1, 1));
            sheet.addMergedRegion(new CellRangeAddress(size, size+1, 4, 4));
            sheet.addMergedRegion(new CellRangeAddress(size, size+1, 7, 7));
            sheet.addMergedRegion(new CellRangeAddress(size, size+1, 10, 10));
            sheet.addMergedRegion(new CellRangeAddress(size, size+1, 11, 11));
            sheet.addMergedRegion(new CellRangeAddress(size, size+1, 12, 12));
            sheet.addMergedRegion(new CellRangeAddress(size, size+1, 13, 13));

            AtomicInteger atomicInteger = new AtomicInteger(0);
            lstColumn.forEach(
                    e -> {
                        if (e.getColumnWidth() != null) {
                            sheet.setColumnWidth(startCol + diff + atomicInteger.getAndIncrement(), e.getColumnWidth());
                        }
                    }
            );

            //trai
            ByteArrayInputStream byteArrayInputStream = createFileOutputReportPrice(
                    lstColumn,
                    lstData.getData(),
                    startRow,
                    startCol,
                    workbook,
                    sheet,
                    displayIndex
            );
            return byteArrayInputStream;
        }
    }

    public Row createFileTitle(
        int startRow,
        int startCol,
        ExcelTitle excelTitle,
        Workbook workbook,
        Sheet sheet,
        short rowHeight,
        int numCol
    ) {
        int rowTitle = startRow > 3 ? startRow - 3 : 0;
        if (excelTitle != null) {
            if (!DataUtil.isNullOrEmpty(excelTitle.getTitle())) {
                Row rowMainTitle = sheet.createRow(rowTitle);
                Cell mainCellTitle = rowMainTitle.createCell(startCol);
                mainCellTitle.setCellValue(excelTitle.getTitle().toUpperCase());
                CellStyle cellStyleTitle = getCellStyleTitle(workbook);
                Font newFont = mainCellTitle.getSheet().getWorkbook().createFont();
                newFont.setFontHeightInPoints((short) 18);
                newFont.setColor(HSSFColor.HSSFColorPredefined.WHITE.getIndex());
                newFont.setFontName(HSSFFont.FONT_ARIAL);
                cellStyleTitle.setFont(newFont);
                mainCellTitle.setCellStyle(cellStyleTitle);
                sheet.addMergedRegion(new CellRangeAddress(rowTitle, rowTitle, startCol, numCol));
            }
            if (!DataUtil.isNullOrEmpty(excelTitle.getDateExportPattern()) && !DataUtil.isNullOrEmpty(excelTitle.getDateExportTitle())) {
                Row rowDateExport = sheet.createRow(rowTitle + 1);
                Cell mainCellTitle = rowDateExport.createCell((numCol / 2));
                mainCellTitle.setCellValue(
                    excelTitle.getDateExportTitle() + " : " + DataUtil.dateToString(new Date(), excelTitle.getDateExportPattern())
                );
                CellStyle cellStyle = createStyle(workbook);
                mainCellTitle.setCellStyle(cellStyle);
            }
        }
        //Header
        Row rowHeader = sheet.createRow(startRow);
        rowHeader.setHeight(rowHeight);

        return rowHeader;
    }

    public Row createFileTitleReportPrice(
            int startRow,
            int startCol,
            ExcelTitle excelTitle,
            Workbook workbook,
            Sheet sheet,
            short rowHeight,
            int numCol
    ) {
        int rowTitle = 0;
        if (excelTitle != null) {
            if (!DataUtil.isNullOrEmpty(excelTitle.getTitle())) {
                Row rowMainTitle = sheet.createRow(rowTitle);
                Cell mainCellTitle = rowMainTitle.createCell(startCol);
                mainCellTitle.setCellValue(excelTitle.getTitle().toUpperCase());
                CellStyle cellStyleTitle = getCellStyleTitle(workbook);
                Font newFont = mainCellTitle.getSheet().getWorkbook().createFont();
                newFont.setFontHeightInPoints((short) 18);
                newFont.setColor(HSSFColor.HSSFColorPredefined.WHITE.getIndex());
                newFont.setFontName(HSSFFont.FONT_ARIAL);
                cellStyleTitle.setFont(newFont);
                mainCellTitle.setCellStyle(cellStyleTitle);
                sheet.addMergedRegion(new CellRangeAddress(rowTitle, rowTitle, startCol, numCol));
            }
            if (!DataUtil.isNullOrEmpty(excelTitle.getDateExportPattern())) {
                Row rowDateExport = sheet.createRow(rowTitle + 1);
                Cell mainCellTitle = rowDateExport.createCell(startCol);
                mainCellTitle.setCellValue(excelTitle.getDateExportPattern());
                CellStyle cellStyle = createStyle(workbook);
                mainCellTitle.setCellStyle(cellStyle);
                sheet.addMergedRegion(new CellRangeAddress(1, 1, startCol, numCol));
            }
        }
        //Header
        Row rowHeader = sheet.createRow(startRow);
        rowHeader.setHeight(rowHeight);

        return rowHeader;
    }


    private CellStyle createCellStyleHeader(Workbook workbook) {
        CellStyle cellStyleHeader = workbook.createCellStyle();
        cellStyleHeader.setAlignment(HorizontalAlignment.CENTER);
        cellStyleHeader.setVerticalAlignment(VerticalAlignment.CENTER);
        cellStyleHeader.setBorderLeft(BorderStyle.THIN);
        cellStyleHeader.setBorderBottom(BorderStyle.THIN);
        cellStyleHeader.setBorderRight(BorderStyle.THIN);
        cellStyleHeader.setBorderTop(BorderStyle.THIN);
        cellStyleHeader.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.index);
        cellStyleHeader.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        cellStyleHeader.setWrapText(true);
        return cellStyleHeader;
    }

    private CellStyle createCellStyle(Workbook workbook) {
        CellStyle cellStyleHeader = workbook.createCellStyle();
        cellStyleHeader.setAlignment(HorizontalAlignment.CENTER);
        cellStyleHeader.setVerticalAlignment(VerticalAlignment.CENTER);
        return cellStyleHeader;
    }

    private Font createFontHeader(Workbook workbook) {
        Font hSSFFontHeader = workbook.createFont();
        hSSFFontHeader.setFontName(HSSFFont.FONT_ARIAL);
        hSSFFontHeader.setFontHeightInPoints((short) 10);
        hSSFFontHeader.setBold(true);
        return hSSFFontHeader;
    }

    public CellStyle createStyleHeader(Workbook workbook) {
        CellStyle cellStyleHeader = createCellStyleHeader(workbook);
        Font hSSFFontHeader = createFontHeader(workbook);
        hSSFFontHeader.setColor(IndexedColors.BLACK.index);
        cellStyleHeader.setFont(hSSFFontHeader);
        return cellStyleHeader;
    }

    private CellStyle createStyle(Workbook workbook) {
        CellStyle cellStyleHeader = createCellStyle(workbook);
        Font hSSFFontHeader = createFontHeader(workbook);
        cellStyleHeader.setFont(hSSFFontHeader);
        return cellStyleHeader;
    }

    private CellStyle createStyleWithFronBold(Workbook workbook) {
        CellStyle cellStyleFontBold = workbook.createCellStyle();
        Font fontWithBold = workbook.createFont();
        fontWithBold.setBold(true);
        cellStyleFontBold.setFont(fontWithBold);
        return cellStyleFontBold;
    }

    private ByteArrayInputStream createFileOutput(
        List<ExcelColumn> lstColumn,
        List<?> lstData,
        int startRow,
        int startCol,
        Workbook workbook,
        Sheet sheet,
        Boolean displayIndex
    ) throws Exception {
        //trai
        CellStyle cellStyleLeft = getCellStyle(workbook, HorizontalAlignment.LEFT);
        //phai
        CellStyle cellStyleRight = getCellStyle(workbook, HorizontalAlignment.RIGHT);
        //giua
        CellStyle cellStyleCenter = getCellStyle(workbook, HorizontalAlignment.CENTER);

        writeDataReport(lstColumn, lstData, startRow, startCol, sheet, cellStyleLeft, cellStyleRight, cellStyleCenter, displayIndex);

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        workbook.write(out);
        return new ByteArrayInputStream(out.toByteArray());
    }
    private ByteArrayInputStream createFileOutputReportPrice(
            List<ExcelColumn> lstColumn,
            List<?> lstData,
            int startRow,
            int startCol,
            Workbook workbook,
            Sheet sheet,
            Boolean displayIndex
    ) throws Exception {
        //trai
        CellStyle cellStyleLeft = getCellStyle(workbook, HorizontalAlignment.LEFT);
        //phai
        CellStyle cellStyleRight = getCellStyle(workbook, HorizontalAlignment.RIGHT);
        //giua
        CellStyle cellStyleCenter = getCellStyle(workbook, HorizontalAlignment.CENTER);

        writeDataReportPrice(lstColumn, lstData, startRow, startCol, sheet, cellStyleLeft, cellStyleRight, cellStyleCenter, displayIndex);

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        workbook.write(out);
        return new ByteArrayInputStream(out.toByteArray());
    }

    public CellStyle getCellStyle(Workbook workbook, HorizontalAlignment horizontalAlignment) {
        CellStyle cellStyleCenter = workbook.createCellStyle();
        cellStyleCenter.setAlignment(horizontalAlignment);
        cellStyleCenter.setVerticalAlignment(VerticalAlignment.CENTER);
        cellStyleCenter.setBorderLeft(BorderStyle.THIN);
        cellStyleCenter.setBorderBottom(BorderStyle.THIN);
        cellStyleCenter.setBorderRight(BorderStyle.THIN);
        cellStyleCenter.setBorderTop(BorderStyle.THIN);
        cellStyleCenter.setWrapText(true);
        cellStyleCenter.setDataFormat((short) BuiltinFormats.getBuiltinFormat("@"));
        return cellStyleCenter;
    }

    private CellStyle getCellStyleTitle(Workbook workbook) {
        CellStyle cellStyleTitle = workbook.createCellStyle();
        cellStyleTitle.setAlignment(HorizontalAlignment.CENTER);
        cellStyleTitle.setVerticalAlignment(VerticalAlignment.CENTER);
        cellStyleTitle.setFillForegroundColor(IndexedColors.GREEN.index);
        cellStyleTitle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

        Font hSSFFont = workbook.createFont();
        hSSFFont.setFontName(HSSFFont.FONT_ARIAL);
        hSSFFont.setFontHeightInPoints((short) 20);
        hSSFFont.setBold(true);
        hSSFFont.setColor(IndexedColors.WHITE.index);
        cellStyleTitle.setFont(hSSFFont);
        return cellStyleTitle;
    }

    private void writeDataReportPrice(
        List<ExcelColumn> lstColumn,
        List<?> lstData,
        int startRow,
        int startCol,
        Sheet sheet,
        CellStyle cellStyleLeft,
        CellStyle cellStyleRight,
        CellStyle cellStyleCenter,
        Boolean displayIndex
    ) throws IllegalAccessException {
        if (lstData != null && !lstData.isEmpty()) {
            Object firstRow = lstData.get(0);
            Map<String, Field> mapField = new HashMap<>();
            for (ExcelColumn column : lstColumn) {
                String header = column.getColumn();
                Field[] fs = ReflectorUtil.getAllFields(firstRow.getClass());
                Arrays
                    .stream(fs)
                    .peek(f -> f.setAccessible(true))
                    .filter(f -> f.getName().equals(header))
                    .forEach(f -> mapField.put(header, f));
            }

            int diff = this.getDiff(displayIndex);
            for (int i = 0; i < lstData.size(); i++) {
                Row row = sheet.createRow(i + startRow + 1);
                if (displayIndex) {
                    Cell cell = row.createCell(startCol);
                    cell.setCellValue(i + 1);
                    cell.setCellStyle(cellStyleCenter);
                }
                for (int j = 0; j < lstColumn.size(); j++) {
                    Cell cell = row.createCell(j + startCol + diff);
                    ExcelColumn column = lstColumn.get(j);
                    Object obj = lstData.get(i);
                    Field f = mapField.get(column.getColumn());
                    if (f != null) {
                        Object value = f.get(obj);
                        String text;
                        if (value instanceof Double) {
                            text = doubleToString((Double) value);
                        } else if (value instanceof Instant) {
                            text = instantToString((Instant) value, column.getPattern());
                        } else if (value instanceof Date) {
                            text = dateToString((Date) value, column.getPattern());
                        } else {
                            text = objectToString(value);
                        }

                        if (!"-".equals(text) && NumberUtils.isCreatable(text)) {
                            text = moneyFormat.format(Double.parseDouble(text));
                        }

                        if (f.getName().contains("ratio") && !"-".equals(text)) {
                            text += "%";
                        }
                        cell.setCellValue(text);
                        this.setCellStyle(cell, column, cellStyleLeft, cellStyleRight, cellStyleCenter);
                    }
                }
            }
        }
    }
    private static boolean isDouble(String param) {
        try {
            Double.parseDouble(param);
        } catch (NumberFormatException e) {
            return false;
        }
        return true;
    }
    private void writeDataReport(
            List<ExcelColumn> lstColumn,
            List<?> lstData,
            int startRow,
            int startCol,
            Sheet sheet,
            CellStyle cellStyleLeft,
            CellStyle cellStyleRight,
            CellStyle cellStyleCenter,
            Boolean displayIndex
    ) throws IllegalAccessException {
        if (lstData != null && !lstData.isEmpty()) {
            Object firstRow = lstData.get(0);
            Map<String, Field> mapField = new HashMap<>();
            for (ExcelColumn column : lstColumn) {
                String header = column.getColumn();
                Field[] fs = ReflectorUtil.getAllFields(firstRow.getClass());
                Arrays
                        .stream(fs)
                        .peek(f -> f.setAccessible(true))
                        .filter(f -> f.getName().equals(header))
                        .forEach(f -> mapField.put(header, f));
            }

            int diff = this.getDiff(displayIndex);
            for (int i = 0; i < lstData.size(); i++) {
                Row row = sheet.createRow(i + startRow + 1);
                if (displayIndex) {
                    Cell cell = row.createCell(startCol);
                    cell.setCellValue(i + 1);
                    cell.setCellStyle(cellStyleCenter);
                }
                for (int j = 0; j < lstColumn.size(); j++) {
                    Cell cell = row.createCell(j + startCol + diff);
                    ExcelColumn column = lstColumn.get(j);
                    Object obj = lstData.get(i);
                    Field f = mapField.get(column.getColumn());
                    if (f != null) {
                        Object value = f.get(obj);
                        String text;
                        if (value instanceof Double) {
                            text = doubleToString((Double) value);
                        } else if (value instanceof Instant) {
                            text = instantToString((Instant) value, column.getPattern());
                        } else if (value instanceof Date) {
                            text = dateToString((Date) value, column.getPattern());
                        } else {
                            text = objectToString(value);
                        }
                        cell.setCellValue(text);
                        this.setCellStyle(cell, column, cellStyleLeft, cellStyleRight, cellStyleCenter);
                    }
                }
            }
        }
    }

    private void setCellStyle(Cell cell, ExcelColumn column, CellStyle cellStyleLeft, CellStyle cellStyleRight, CellStyle cellStyleCenter) {
        if (ExcelColumn.ALIGN_MENT.CENTER.equals(column.getAlign())) {
            cell.setCellStyle(cellStyleCenter);
        }
        if (ExcelColumn.ALIGN_MENT.LEFT.equals(column.getAlign())) {
            cell.setCellStyle(cellStyleLeft);
        }
        if (ExcelColumn.ALIGN_MENT.RIGHT.equals(column.getAlign())) {
            cell.setCellStyle(cellStyleRight);
        }
    }

    private String instantToString(Instant value, String pattern) {
        if (pattern != null) {
            DateTimeFormatter dtf = DateTimeFormatter.ofPattern(pattern);
            return dtf.format(LocalDateTime.ofInstant(value, ZoneId.of(Constants.TIME_ZONE_DEFAULT)));
        }
        return "";
    }

    private String dateToString(Date value, String pattern) {
        if (pattern != null) {
            SimpleDateFormat dtf = new SimpleDateFormat(pattern);
            return dtf.format(value);
        }
        return "";
    }

    private String objectToString(Object value) {
        return (value == null) ? "" : value.toString();
    }

    private String doubleToString(Double value) {
        if (value == null) {
            return "";
        }
        String result = doubleFormat.format(value);
        if (result.endsWith(".0")) {
            result = result.split("\\.")[0];
        }
        return result;
    }

    private int getDiff(Boolean displayIndex) {
        return Boolean.TRUE.equals(displayIndex) ? 1 : 0;
    }

    public String getRowString(Row row, int col) {
        String result = null;
        Cell cell = row.getCell(col);
        if (cell != null) {
            switch (cell.getCellType()) {
                case NUMERIC:
                    result = new DecimalFormat("#.#").format(cell.getNumericCellValue());
                    if (result.endsWith(".0")) {
                        result = result.substring(0, result.lastIndexOf("."));
                    }
                    break;
                case STRING:
                    result = cell.getStringCellValue();
                    break;
                default:
                    break;
            }
        }
        return result;
    }

    /**
     * @param lstColumn
     * @param lstData
     * @param startRow
     * @param startCol
     * @param excelTitle
     * @param displayIndex
     * @return
     * @throws Exception
     */
    public ByteArrayInputStream onExport2Sheet(
        List<ExcelColumn> lstColumn,
        List<?> lstData,
        List<?> lstData1,
        int startRow,
        int startCol,
        ExcelTitle excelTitle,
        Boolean displayIndex,
        String titleSheet1,
        String titleSheet2
    ) throws Exception {
        try (Workbook workbook = new XSSFWorkbook()) {
            //Create Sheet1:
            Sheet sheet = workbook.createSheet(titleSheet1);
            int diff = this.getDiff(displayIndex);

            Row rowHeader = createFileTitle(startRow, startCol, excelTitle, workbook, sheet, (short) 500, (lstColumn.size() - 1 + diff));

            CellStyle cellStyleHeader = createStyleHeader(workbook);

            if (Boolean.TRUE.equals(displayIndex)) {
                Cell cellIndex = rowHeader.createCell(startCol);
                cellIndex.setCellValue("STT");
                cellIndex.setCellStyle(cellStyleHeader);
            }
            for (int i = 0; i < lstColumn.size(); i++) {
                Cell cellHeader = rowHeader.createCell(i + startCol + diff);
                cellHeader.setCellValue(lstColumn.get(i).getTitle());
                cellHeader.setCellStyle(cellStyleHeader);
            }
            AtomicInteger atomicInteger = new AtomicInteger(0);
            lstColumn.forEach(
                e -> {
                    if (e.getColumnWidth() != null) {
                        sheet.setColumnWidth(startCol + diff + atomicInteger.getAndIncrement(), e.getColumnWidth());
                    }
                }
            );

            //Create Sheet2:
            Sheet sheet1 = workbook.createSheet(titleSheet2);

            rowHeader = createFileTitle(startRow, startCol, excelTitle, workbook, sheet1, (short) 500, (lstColumn.size() - 1 + diff));

            if (Boolean.TRUE.equals(displayIndex)) {
                Cell cellIndex = rowHeader.createCell(startCol);
                cellIndex.setCellValue("STT");
                cellIndex.setCellStyle(cellStyleHeader);
            }
            for (int i = 0; i < lstColumn.size(); i++) {
                Cell cellHeader = rowHeader.createCell(i + startCol + diff);
                cellHeader.setCellValue(lstColumn.get(i).getTitle());
                cellHeader.setCellStyle(cellStyleHeader);
            }
            AtomicInteger atomicInteger1 = new AtomicInteger(0);
            lstColumn.forEach(
                e -> {
                    if (e.getColumnWidth() != null) {
                        sheet1.setColumnWidth(startCol + diff + atomicInteger1.getAndIncrement(), e.getColumnWidth());
                    }
                }
            );

            //trai
            ByteArrayInputStream byteArrayInputStream = createFileOutput(
                lstColumn,
                lstData,
                lstData1,
                startRow,
                startCol,
                workbook,
                sheet,
                sheet1,
                displayIndex
            );
            return byteArrayInputStream;
        }
    }

    /**
     * @param lstColumn
     * @param lstData
     * @param startRow
     * @param startCol
     * @param workbook
     * @param sheet1       * @param sheet2
     * @param displayIndex
     * @return
     * @throws Exception
     */
    private ByteArrayInputStream createFileOutput(
        List<ExcelColumn> lstColumn,
        List<?> lstData,
        List<?> lstData1,
        int startRow,
        int startCol,
        Workbook workbook,
        Sheet sheet1,
        Sheet sheet2,
        Boolean displayIndex
    ) throws Exception {
        //trai
        CellStyle cellStyleLeft = getCellStyle(workbook, HorizontalAlignment.LEFT);
        //phai
        CellStyle cellStyleRight = getCellStyle(workbook, HorizontalAlignment.RIGHT);
        //giua
        CellStyle cellStyleCenter = getCellStyle(workbook, HorizontalAlignment.CENTER);

        writeDataReport(lstColumn, lstData, startRow, startCol, sheet1, cellStyleLeft, cellStyleRight, cellStyleCenter, displayIndex);
        writeDataReport(lstColumn, lstData1, startRow, startCol, sheet2, cellStyleLeft, cellStyleRight, cellStyleCenter, displayIndex);

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        workbook.write(out);
        return new ByteArrayInputStream(out.toByteArray());
    }

    private CellStyle getTitleStyle(Workbook workbook) {
        CellStyle cellStyleTitle = workbook.createCellStyle();
        cellStyleTitle.setAlignment(HorizontalAlignment.LEFT);
        cellStyleTitle.setVerticalAlignment(VerticalAlignment.CENTER);
        //        cellStyleTitle.setFillForegroundColor(IndexedColors.GREEN.index);
        //        cellStyleTitle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

        Font hSSFFont = workbook.createFont();
        hSSFFont.setFontName(HSSFFont.FONT_ARIAL);
        hSSFFont.setFontHeightInPoints((short) 15);
        hSSFFont.setBold(true);
        hSSFFont.setColor(IndexedColors.BLACK.index);
        cellStyleTitle.setFont(hSSFFont);
        return cellStyleTitle;
    }


    public ByteArrayInputStream onExportRegisterPackage(List<ManagementRegistrationDTO> lstData, String title) throws Exception {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("RegisterPackage");

            Font hSSFFontHeader = workbook.createFont();
            hSSFFontHeader.setFontName(HSSFFont.FONT_ARIAL);
            hSSFFontHeader.setColor(HSSFColor.HSSFColorPredefined.WHITE.getIndex());
            hSSFFontHeader.setFontHeightInPoints((short) 14);
            hSSFFontHeader.setBold(true);

            Row rowHeader1 = sheet.createRow(0);
            Cell cellHeader1 = rowHeader1.createCell(0);
            CellStyle style = workbook.createCellStyle();

            style.setFillForegroundColor(IndexedColors.GREEN.getIndex());
            style.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            style.setAlignment(HorizontalAlignment.CENTER);
            style.setVerticalAlignment(VerticalAlignment.CENTER);

            style.setFont(hSSFFontHeader);
            cellHeader1.setCellStyle(style);
            cellHeader1.setCellValue(title);
            sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 11));

//            Font hSSFFontTitle = workbook.createFont();
//            hSSFFontTitle.setFontName(HSSFFont.FONT_ARIAL);
//            hSSFFontTitle.setFontHeightInPoints((short) 13);
//            hSSFFontTitle.setBold(true);
//
//            Row rowHeader2 = sheet.createRow(1);
//            Cell cellHeader2 = rowHeader2.createCell(0);
//            CellStyle styleTitle = workbook.createCellStyle();
//            styleTitle.setFillForegroundColor(IndexedColors.BRIGHT_GREEN.getIndex());
//            styleTitle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
//            styleTitle.setAlignment(HorizontalAlignment.CENTER);
//            styleTitle.setVerticalAlignment(VerticalAlignment.CENTER);
//            styleTitle.setFont(hSSFFontTitle);
//            cellHeader2.setCellStyle(styleTitle);
//            cellHeader2.setCellValue(years);
//            sheet.addMergedRegion(new CellRangeAddress(1, 1, 0, 9));

            sheet.setColumnWidth(0, 1500);
            sheet.setColumnWidth(1, 5000);
            sheet.setColumnWidth(2, 5000);
            sheet.setColumnWidth(3, 5000);
            sheet.setColumnWidth(4, 7000);
            sheet.setColumnWidth(5, 5000);
            sheet.setColumnWidth(6, 5000);
            sheet.setColumnWidth(7, 4200);
            sheet.setColumnWidth(8, 4000);
            sheet.setColumnWidth(9, 4000);
            sheet.setColumnWidth(10, 5000);
            sheet.setColumnWidth(11, 7000);

            Font hSSFFontTable = workbook.createFont();
            hSSFFontTable.setFontName(HSSFFont.FONT_ARIAL);
            hSSFFontTable.setFontHeightInPoints((short) 10);
            hSSFFontTable.setBold(true);

            //style header
            CellStyle style1 = workbook.createCellStyle();
            style1.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            style1.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            style1.setFont(hSSFFontTable);
            style1.setAlignment(HorizontalAlignment.CENTER);
            style1.setVerticalAlignment(VerticalAlignment.CENTER);
            style1.setBorderLeft(BorderStyle.THIN);
            style1.setBorderBottom(BorderStyle.THIN);
            style1.setBorderRight(BorderStyle.THIN);
            style1.setBorderTop(BorderStyle.THIN);
            style1.setWrapText(true);

            Font hSSFFontTable1 = workbook.createFont();
            hSSFFontTable1.setFontName(HSSFFont.FONT_ARIAL);
            hSSFFontTable1.setFontHeightInPoints((short) 10);
            hSSFFontTable1.setBold(false);


            //Can le trai
            CellStyle style2 = workbook.createCellStyle();
            style2.setFont(hSSFFontTable1);
            style2.setAlignment(HorizontalAlignment.LEFT);
            style2.setVerticalAlignment(VerticalAlignment.CENTER);
            style2.setBorderLeft(BorderStyle.THIN);
            style2.setBorderBottom(BorderStyle.THIN);
            style2.setBorderRight(BorderStyle.THIN);
            style2.setBorderTop(BorderStyle.THIN);
            style2.setWrapText(true);

            //can le giua
            CellStyle style3 = workbook.createCellStyle();
            style3.setFont(hSSFFontTable1);
            style3.setAlignment(HorizontalAlignment.CENTER);
            style3.setVerticalAlignment(VerticalAlignment.CENTER);
            style3.setBorderLeft(BorderStyle.THIN);
            style3.setBorderBottom(BorderStyle.THIN);
            style3.setBorderRight(BorderStyle.THIN);
            style3.setBorderTop(BorderStyle.THIN);
            style3.setWrapText(true);

            Row tableTitle1 = sheet.createRow(2);
            Row tableTitle2 = sheet.createRow(3);

            Cell cell1 = tableTitle1.createCell(5);
            Cell cell2 = tableTitle1.createCell(6);
            Cell cell3 = tableTitle1.createCell(7);
            Cell cell10 = tableTitle1.createCell(9);
            cell1.setCellStyle(style1);
            cell2.setCellStyle(style1);
            cell3.setCellStyle(style1);
            cell10.setCellStyle(style1);

            Cell cell4 = tableTitle2.createCell(0);
            Cell cell5 = tableTitle2.createCell(1);
            Cell cell6 = tableTitle2.createCell(2);
            Cell cell7 = tableTitle2.createCell(3);
            Cell cell8 = tableTitle2.createCell(10);
            Cell cell9 = tableTitle2.createCell(11);
            cell4.setCellStyle(style1);
            cell5.setCellStyle(style1);
            cell6.setCellStyle(style1);
            cell7.setCellStyle(style1);
            cell8.setCellStyle(style1);
            cell9.setCellStyle(style1);

            Cell cellTableTitle1 = tableTitle1.createCell(0);
            cellTableTitle1.setCellStyle(style1);
            cellTableTitle1.setCellValue(Translator.toLocale("_stt"));
            sheet.addMergedRegion(new CellRangeAddress(2, 3, 0, 0));

            Cell cellTableTitle2 = tableTitle1.createCell(1);
            cellTableTitle2.setCellStyle(style1);
            cellTableTitle2.setCellValue(Translator.toLocale("_studentCode"));
            sheet.addMergedRegion(new CellRangeAddress(2, 3, 1, 1));

            Cell cellTableTitle3 = tableTitle1.createCell(2);
            cellTableTitle3.setCellStyle(style1);
            cellTableTitle3.setCellValue(Translator.toLocale("_studentName"));
            sheet.addMergedRegion(new CellRangeAddress(2, 3, 2, 2));

            Cell cellTableTitle4 = tableTitle1.createCell(3);
            cellTableTitle4.setCellStyle(style1);
            cellTableTitle4.setCellValue(Translator.toLocale("_school"));
            sheet.addMergedRegion(new CellRangeAddress(2, 3, 3, 3));

            Cell cellTableTitle5 = tableTitle1.createCell(4);
            cellTableTitle5.setCellStyle(style1);
            cellTableTitle5.setCellValue(Translator.toLocale("_inforRegister"));
            sheet.addMergedRegion(new CellRangeAddress(2, 2, 4, 7));

            Cell cellTableTitle6 = tableTitle2.createCell(4);
            cellTableTitle6.setCellStyle(style1);
            cellTableTitle6.setCellValue(Translator.toLocale("_phoneParent"));

            Cell cellTableTitle7 = tableTitle2.createCell(5);
            cellTableTitle7.setCellStyle(style1);
            cellTableTitle7.setCellValue(Translator.toLocale("_pachkageRegister"));

            Cell cellTableTitle8 = tableTitle2.createCell(6);
            cellTableTitle8.setCellStyle(style1);
            cellTableTitle8.setCellValue(Translator.toLocale("_dateRegister"));

            Cell cellTableTitle9 = tableTitle2.createCell(7);
            cellTableTitle9.setCellStyle(style1);
            cellTableTitle9.setCellValue(Translator.toLocale("_creator"));

            Cell cellTableTitle10 = tableTitle1.createCell(8);
            cellTableTitle10.setCellStyle(style1);
            cellTableTitle10.setCellValue(Translator.toLocale("_duration"));
            sheet.addMergedRegion(new CellRangeAddress(2, 2, 8, 9));

            Cell cellTableTitle11 = tableTitle2.createCell(8);
            cellTableTitle11.setCellStyle(style1);
            cellTableTitle11.setCellValue(Translator.toLocale("_from"));

            Cell cellTableTitle12 = tableTitle2.createCell(9);
            cellTableTitle12.setCellStyle(style1);
            cellTableTitle12.setCellValue(Translator.toLocale("_to"));


            Cell cellTableTitle13 = tableTitle1.createCell(10);
            cellTableTitle13.setCellStyle(style1);
            cellTableTitle13.setCellValue(Translator.toLocale("_dateActive"));
            sheet.addMergedRegion(new CellRangeAddress(2, 3, 10, 10));

            Cell cellTableTitle14 = tableTitle1.createCell(11);
            cellTableTitle14.setCellStyle(style1);
            cellTableTitle14.setCellValue(Translator.toLocale("_statusRegister"));
            sheet.addMergedRegion(new CellRangeAddress(2, 3, 11, 11));

            SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");

            for (int i = 0; i < lstData.size(); i++) {
                Row rowInsert = sheet.createRow(i + 4);

                Cell cellInsert1 = rowInsert.createCell(0);
                cellInsert1.setCellStyle(style3);
                cellInsert1.setCellValue(i + 1);

                Cell cellInsert2 = rowInsert.createCell(1);
                cellInsert2.setCellStyle(style2);
                cellInsert2.setCellValue(lstData.get(i).getStudentCode());

                Cell cellInsert3 = rowInsert.createCell(2);
                cellInsert3.setCellStyle(style2);
                cellInsert3.setCellValue(lstData.get(i).getStudentName());

                Cell cellInsert4 = rowInsert.createCell(3);
                cellInsert4.setCellStyle(style2);
                cellInsert4.setCellValue(lstData.get(i).getSchoolName());

                Cell cellInsert5 = rowInsert.createCell(4);
                cellInsert5.setCellStyle(style2);
                cellInsert5.setCellValue(lstData.get(i).getPhone());

                Cell cellInsert6 = rowInsert.createCell(5);
                cellInsert6.setCellStyle(style2);
                cellInsert6.setCellValue(lstData.get(i).getDataPackage());


                Cell cellInsert7 = rowInsert.createCell(6);
                cellInsert7.setCellStyle(style3);
                Date createDate = Date.from(lstData.get(i).getCreateDate());
                String formattedDate = formatter.format(createDate);
                cellInsert7.setCellValue(formattedDate);

                Cell cellInsert8 = rowInsert.createCell(7);
                cellInsert8.setCellStyle(style2);
                if (lstData.get(i).getCreator() != null) {
                    int a = Integer.parseInt(lstData.get(i).getCreator());
                    switch (a) {
                        case 1:
                            cellInsert8.setCellValue(Translator.toLocale("_schoolRegister"));
                            break;
                        case 2:
                            cellInsert8.setCellValue(Translator.toLocale("_parentRegister"));
                            break;
                    }
                }

                Cell cellInsert9 = rowInsert.createCell(8);
                cellInsert9.setCellStyle(style3);
                String startDate = formatter.format(lstData.get(i).getStartDate());
                cellInsert9.setCellValue(startDate);

                Cell cellInsert10 = rowInsert.createCell(9);
                cellInsert10.setCellStyle(style3);
                String endDate = formatter.format(lstData.get(i).getEndDate());
                cellInsert10.setCellValue(endDate);

                Cell cellInsert11 = rowInsert.createCell(10);
                cellInsert11.setCellStyle(style3);
                if(lstData.get(i).getActiveDate() != null){
                    String activeDate = formatter.format(lstData.get(i).getActiveDate());
                    cellInsert11.setCellValue(activeDate);
                }

                Cell cellInsert12 = rowInsert.createCell(11);
                cellInsert12.setCellStyle(style2);
                 if (lstData.get(i).getStatus() != null) {
                    long a = lstData.get(i).getStatus();
                    switch ((int) a) {
                        case 1:
                            cellInsert12.setCellValue(Translator.toLocale("_waiting_for_activation"));
                            break;
                        case 2:
                            cellInsert12.setCellValue(Translator.toLocale("_activatedRegister"));
                            break;
                        case 3:
                            cellInsert12.setCellValue(Translator.toLocale("_cancelRegister"));
                            break;
                    }
                }

            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }


    public ByteArrayInputStream exportPackageStatistics(
        List<PackageStatisticsReturnDTO> lstData,
        String title,
        String years
    ) throws Exception {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Data");

            Font hSSFFontHeader = workbook.createFont();
            hSSFFontHeader.setFontName(HSSFFont.FONT_ARIAL);
            hSSFFontHeader.setColor(HSSFColor.HSSFColorPredefined.WHITE.getIndex());
            hSSFFontHeader.setFontHeightInPoints((short) 14);
            hSSFFontHeader.setBold(true);

            Row rowHeader1 = sheet.createRow(0);
            Cell cellHeader1 = rowHeader1.createCell(0);
            CellStyle style = workbook.createCellStyle();

            style.setFillForegroundColor(IndexedColors.GREEN.getIndex());
            style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            style.setAlignment(HorizontalAlignment.CENTER);
            style.setVerticalAlignment(VerticalAlignment.CENTER);

            style.setFont(hSSFFontHeader);
            cellHeader1.setCellStyle(style);
            cellHeader1.setCellValue(title);
            sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 5 ));

            Font hSSFFontTitle = workbook.createFont();
            hSSFFontTitle.setFontName(HSSFFont.FONT_ARIAL);
            hSSFFontTitle.setFontHeightInPoints((short) 12);
            hSSFFontTitle.setBold(true);

            Row rowHeader2 = sheet.createRow(1);
            Cell cellHeader2 = rowHeader2.createCell(0);
            CellStyle styleTitle = workbook.createCellStyle();;
            styleTitle.setAlignment(HorizontalAlignment.CENTER);
            styleTitle.setVerticalAlignment(VerticalAlignment.CENTER);
            styleTitle.setFont(hSSFFontTitle);
            cellHeader2.setCellStyle(styleTitle);
            cellHeader2.setCellValue(years);
            sheet.addMergedRegion(new CellRangeAddress(1, 1, 0, 5));

            sheet.setColumnWidth(0, 2500);
            sheet.setColumnWidth(1, 5000);
            sheet.setColumnWidth(2, 10000);
            sheet.setColumnWidth(3, 5000);
            sheet.setColumnWidth(4, 5000);
            sheet.setColumnWidth(5, 7000);
//

            Font hSSFFontTable = workbook.createFont();
            hSSFFontTable.setFontName(HSSFFont.FONT_ARIAL);
            hSSFFontTable.setFontHeightInPoints((short) 10);
            hSSFFontTable.setBold(true);



            CellStyle style1 = workbook.createCellStyle();
            style1.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            style1.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            style1.setFont(hSSFFontTable);
            style1.setAlignment(HorizontalAlignment.CENTER);
            style1.setVerticalAlignment(VerticalAlignment.CENTER);
            style1.setBorderLeft(BorderStyle.THIN);
            style1.setBorderBottom(BorderStyle.THIN);
            style1.setBorderRight(BorderStyle.THIN);
            style1.setBorderTop(BorderStyle.THIN);
            style1.setWrapText(true);

            Font hSSFFontTable1 = workbook.createFont();
            hSSFFontTable1.setFontName(HSSFFont.FONT_ARIAL);
            hSSFFontTable1.setFontHeightInPoints((short) 10);
            hSSFFontTable1.setBold(false);

            //can trai
            CellStyle style2 = workbook.createCellStyle();
            style2.setFont(hSSFFontTable1);
            style2.setAlignment(HorizontalAlignment.LEFT);
            style2.setVerticalAlignment(VerticalAlignment.CENTER);
            style2.setBorderLeft(BorderStyle.THIN);
            style2.setBorderBottom(BorderStyle.THIN);
            style2.setBorderRight(BorderStyle.THIN);
            style2.setBorderTop(BorderStyle.THIN);
            style2.setWrapText(true);

            //can giua
            CellStyle style3 = workbook.createCellStyle();
            style3.setFont(hSSFFontTable1);
            style3.setAlignment(HorizontalAlignment.CENTER);
            style3.setVerticalAlignment(VerticalAlignment.CENTER);
            style3.setBorderLeft(BorderStyle.THIN);
            style3.setBorderBottom(BorderStyle.THIN);
            style3.setBorderRight(BorderStyle.THIN);
            style3.setBorderTop(BorderStyle.THIN);
            style3.setWrapText(true);

            // border tren duoi
            CellStyle style4 = workbook.createCellStyle();
            style4.setBorderBottom(BorderStyle.THIN);
            style4.setBorderTop(BorderStyle.THIN);
//            style4.setWrapText(true);

            // can trai goi cuoc
            CellStyle style5 = workbook.createCellStyle();
            style5.setFont(hSSFFontTable);
            style5.setAlignment(HorizontalAlignment.LEFT);
            style5.setVerticalAlignment(VerticalAlignment.CENTER);
            style5.setBorderLeft(BorderStyle.THIN);
            style5.setBorderBottom(BorderStyle.THIN);
            style5.setBorderRight(BorderStyle.THIN);
            style5.setBorderTop(BorderStyle.THIN);
            style5.setWrapText(true);


            DataFormat fmt = workbook.createDataFormat();
            //can giua tong goi cuoc
            CellStyle style6 = workbook.createCellStyle();
            style6.setDataFormat(fmt.getFormat("###,###,0"));
            style6.setFont(hSSFFontTable);
            style6.setAlignment(HorizontalAlignment.CENTER);
            style6.setVerticalAlignment(VerticalAlignment.CENTER);
            style6.setBorderLeft(BorderStyle.THIN);
            style6.setBorderBottom(BorderStyle.THIN);
            style6.setBorderRight(BorderStyle.THIN);
            style6.setBorderTop(BorderStyle.THIN);
            style6.setWrapText(true);

            CellStyle style7 = workbook.createCellStyle();
            style7.setDataFormat(fmt.getFormat("###,###,0"));
            style7.setFont(hSSFFontTable1);
            style7.setAlignment(HorizontalAlignment.CENTER);
            style7.setVerticalAlignment(VerticalAlignment.CENTER);
            style7.setBorderLeft(BorderStyle.THIN);
            style7.setBorderBottom(BorderStyle.THIN);
            style7.setBorderRight(BorderStyle.THIN);
            style7.setBorderTop(BorderStyle.THIN);
            style7.setWrapText(true);

            Row tableTitle1 = sheet.createRow(3);

            Cell cellTableTitle1 = tableTitle1.createCell(0);
            cellTableTitle1.setCellStyle(style1);
            cellTableTitle1.setCellValue(Translator.toLocale("stt"));

            Cell cellTableTitle2 = tableTitle1.createCell(1);
            cellTableTitle2.setCellStyle(style1);
            cellTableTitle2.setCellValue(Translator.toLocale("_schoolCode"));

            Cell cellTableTitle3 = tableTitle1.createCell(2);
            cellTableTitle3.setCellStyle(style1);
            cellTableTitle3.setCellValue(Translator.toLocale("_schoolName"));

            Cell cellTableTitle4 = tableTitle1.createCell(3);
            cellTableTitle4.setCellStyle(style1);
            cellTableTitle4.setCellValue(Translator.toLocale("_level"));

            Cell cellTableTitle5 = tableTitle1.createCell(4);
            cellTableTitle5.setCellStyle(style1);
            cellTableTitle5.setCellValue(Translator.toLocale("_province"));

            Cell cellTableTitle6 = tableTitle1.createCell(5);
            cellTableTitle6.setCellStyle(style1);
            cellTableTitle6.setCellValue(Translator.toLocale("_total_user"));

            if(lstData!=null){
                int count = 0;
                for(int i =0 ; i < lstData.size(); i++){
                    int stt = 1;
                    count ++;
                    Row rowPackageName = sheet.createRow(3+count);
                    Cell cellPackageName = rowPackageName.createCell(0);
                    Cell cellTotal = rowPackageName.createCell(5);

                    cellPackageName.setCellStyle(style5);
                    cellPackageName.setCellValue(Translator.toLocale("_dataPackage")+": "+lstData.get(i).getDataPackageCode());
                    sheet.addMergedRegion(new CellRangeAddress(3+count, 3+count, 0,4 ));

                    cellTotal.setCellStyle(style6);
                    cellTotal.setCellValue(lstData.get(i).getTotalRegisted());
//                    cellTotal.setCellValue(String.format("%,d", lstData.get(i).getTotalRegisted()));
//                    cellTotal.setCellValue(doubleFormat1.format(lstData.get(i).getTotalRegisted()));

                    if(lstData.get(i).getTotalRegisted()==0){
                        Cell cellFillBorder1 = rowPackageName.createCell(1);
                        Cell cellFillBorder2 = rowPackageName.createCell(2);
                        Cell cellFillBorder3 = rowPackageName.createCell(3);
                        Cell cellFillBorder4 = rowPackageName.createCell(4);
                        cellFillBorder1.setCellStyle(style4);
                        cellFillBorder2.setCellStyle(style4);
                        cellFillBorder3.setCellStyle(style4);
                        cellFillBorder4.setCellStyle(style4);
                        continue;
                    }
                    for(int j =0; j< lstData.get(i).getChildren().size(); j++){
                        count++;
                        Row listSchool = sheet.createRow(3+count);
                        Cell cellSchool0 = listSchool.createCell(0);
                        Cell cellSchool1 = listSchool.createCell(1);
                        Cell cellSchool2 = listSchool.createCell(2);
                        Cell cellSchool3 = listSchool.createCell(3);
                        Cell cellSchool4 = listSchool.createCell(4);
                        Cell cellSchool5 = listSchool.createCell(5);

                        cellSchool0.setCellStyle(style3);
                        cellSchool1.setCellStyle(style2);
                        cellSchool2.setCellStyle(style2);
                        cellSchool3.setCellStyle(style2);
                        cellSchool4.setCellStyle(style2);
                        cellSchool5.setCellStyle(style7);

                        cellSchool0.setCellValue(stt+j);
                        cellSchool1.setCellValue(lstData.get(i).getChildren().get(j).getSchoolCode());
                        cellSchool2.setCellValue(lstData.get(i).getChildren().get(j).getSchoolName());
                        cellSchool3.setCellValue(lstData.get(i).getChildren().get(j).getLevelSchoolName());
                        cellSchool4.setCellValue(lstData.get(i).getChildren().get(j).getProvinceName());
                        cellSchool5.setCellValue(lstData.get(i).getChildren().get(j).getCountRegister1PackageOf1School());

//                        cellSchool5.setCellValue(String.format("%,d", lstData.get(i).getChildren().get(j).getCountRegister1PackageOf1School()));
//                        cellSchool5.setCellValue(doubleFormat1.format(lstData.get(i).getChildren().get(j).getCountRegister1PackageOf1School()));

                    }
                }
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }
}
