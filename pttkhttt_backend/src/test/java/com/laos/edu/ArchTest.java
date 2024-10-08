package com.laos.edu;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.core.importer.ClassFileImporter;
import com.tngtech.archunit.core.importer.ImportOption;
import org.junit.jupiter.api.Test;

class ArchTest {

    @Test
    void servicesAndRepositoriesShouldNotDependOnWebLayer() {
        JavaClasses importedClasses = new ClassFileImporter()
            .withImportOption(ImportOption.Predefined.DO_NOT_INCLUDE_TESTS)
            .importPackages("com.laos.edu");

        noClasses()
            .that()
            .resideInAnyPackage("com.laos.edu.service..")
            .or()
            .resideInAnyPackage("com.laos.edu.repository..")
            .should()
            .dependOnClassesThat()
            .resideInAnyPackage("..com.laos.edu.web..")
            .because("Services and repositories should not depend on web layer")
            .check(importedClasses);
    }
}
